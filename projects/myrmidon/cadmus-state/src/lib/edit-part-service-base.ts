import { ItemService, ThesaurusService } from '@myrmidon/cadmus-api';
import { Part } from '@myrmidon/cadmus-core';
import { forkJoin } from 'rxjs';

export interface EditPartStoreApi {
  update(value: any): void;
  setLoading(value: boolean): void;
  setDirty(value: boolean): void;
  setSaving(value: boolean): void;
  setError(value: string): void;
}

export abstract class EditPartServiceBase {
  protected store: EditPartStoreApi;

  constructor(
    protected itemService: ItemService,
    protected thesaurusService: ThesaurusService
  ) {}

  public load(partId: string | null, thesauriIds: string[] | null = null): void {
    this.store.setLoading(true);

    if (thesauriIds) {
      // remove trailing ! from IDs if any
      const unscopedIds = thesauriIds.map((id) => {
        return this.thesaurusService.getScopedId(id, null);
      });

      forkJoin({
        part: this.itemService.getPart(partId),
        thesauri: this.thesaurusService.getThesauriSet(unscopedIds),
      }).subscribe((result) => {
        this.store.setLoading(false);
        this.store.update({
          part: result.part,
          thesauri: result.thesauri,
        });
        // if the loaded part has a thesaurus scope, reload the thesauri
        if (result.part?.thesaurusScope) {
          const scopedIds: string[] = thesauriIds.map((id) => {
            return this.thesaurusService.getScopedId(
              id,
              result.part.thesaurusScope
            );
          });
          this.store.setLoading(true);
          this.thesaurusService.getThesauriSet(thesauriIds).subscribe(
            (thesauri) => {
              this.store.update({
                thesauri,
              });
            },
            (error) => {
              console.error(error);
              this.store.setLoading(false);
              this.store.setError(
                'Error loading thesauri ' + scopedIds.join(', ')
              );
            }
          );
        } // scoped
      });
    } else {
      if (!partId) {
        return;
      }
      this.itemService.getPart(partId).subscribe(
        (part) => {
          this.store.update({
            part,
            loading: false,
            error: null,
          });
        },
        (error) => {
          console.error(error);
          this.store.setLoading(false);
          this.store.setError('Error loading part ' + partId);
        }
      );
    }
  }

  /**
   * Save the JSON code representing a part.
   *
   * @param json The JSON code representing the part.
   * @returns Promise which when successful returns the
   * saved part.
   */
  public save(json: string): Promise<Part> {
    this.store.setSaving(true);
    this.store.setDirty(true);

    return new Promise((resolve, reject) => {
      this.itemService.addPartJson(json).subscribe(
        (part: Part) => {
          this.store.update({ part });
          this.store.setSaving(false);
          this.store.setDirty(false);
          this.store.setError(null);
          resolve(part);
        },
        (error) => {
          console.error(error);
          this.store.setSaving(false);
          this.store.setError('Error saving part');
          reject(error);
        }
      );
    });
  }

  public setDirty(value = true): void {
    this.store.setDirty(value);
  }
}
