import { ItemService, ThesaurusService } from '@myrmidon/cadmus-api';
import { Part } from '@myrmidon/cadmus-core';
import { forkJoin } from 'rxjs';

/**
 * API provided by any Akita-based part store.
 */
export interface EditPartStoreApi {
  update(value: any): void;
  setLoading(value: boolean): void;
  setDirty(value: boolean): void;
  setSaving(value: boolean): void;
  setError(value: string): void;
}

/**
 * Base class for part editor services.
 */
export abstract class EditPartServiceBase {
  protected store: EditPartStoreApi;

  constructor(
    protected itemService: ItemService,
    protected thesaurusService: ThesaurusService
  ) {}

  /**
   * Load into the state the part with the specified ID
   * and its thesauri.
   * If the ID is not specified, it's a new part; in this case,
   * it will get a null ID, but use the specified itemId and roleId.
   *
   * @param partId The part ID, unless it's a new part.
   * @param thesauriIds The thesauri IDs array, or null.
   * @param itemId The item ID for the new part.
   * @param typeId The part type ID for the new part.
   * @param roleId The role ID for the new part.
   */
  public load(
    partId?: string,
    thesauriIds: string[] | null = null,
    itemId?: string,
    typeId?: string,
    roleId?: string
  ): void {
    // signal that we're loading
    this.store.setLoading(true);

    // if thesauri are required:
    if (thesauriIds) {
      // remove trailing ! from IDs if any
      const unscopedIds = thesauriIds.map((id) => {
        return this.thesaurusService.getScopedId(id, null);
      });

      // fetch part and thesauri
      forkJoin({
        part: this.itemService.getPart(partId),
        thesauri: this.thesaurusService.getThesauriSet(unscopedIds),
      }).subscribe((result) => {
        // loading has ended
        this.store.setLoading(false);
        // update the store with a new or existing part,
        // and its requested thesauri
        this.store.update({
          part: result.part || {
            id: null,
            itemId,
            typeId,
            roleId,
          },
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
          // loading again
          this.store.setLoading(true);
          this.thesaurusService.getThesauriSet(scopedIds).subscribe(
            (thesauri) => {
              // completed, replace the thesauri
              this.store.update({
                thesauri,
                loading: false,
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
      // without thesauri to be fetched, just fetch the part
      this.itemService.getPart(partId).subscribe(
        (part) => {
          this.store.update({
            part: part || {
              id: null,
              itemId,
              typeId,
              roleId,
            },
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
   * Save the part.
   *
   * @param part The part.
   * @returns Promise which when successful returns the saved part.
   */
  public save(part: Part): Promise<Part> {
    this.store.setSaving(true);
    this.store.setDirty(true);

    return new Promise((resolve, reject) => {
      this.itemService.addPart(part).subscribe(
        (saved: Part) => {
          this.store.update({
            part: saved,
            saving: false,
            dirty: false,
            error: null,
          });
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
