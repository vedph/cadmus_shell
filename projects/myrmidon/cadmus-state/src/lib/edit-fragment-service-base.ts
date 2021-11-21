import { ItemService, ThesaurusService } from '@myrmidon/cadmus-api';
import { forkJoin } from 'rxjs';
import { Part, TextLayerPart } from '@myrmidon/cadmus-core';

/**
 * API provided by any Akita-based fragment store.
 */
export interface EditFragmentStoreApi {
  update(value: any): void;
  setLoading(value: boolean): void;
  setDirty(value: boolean): void;
  setSaving(value: boolean): void;
  setError(value: string): void;
}

/**
 * Base class for fragment editor services.
 */
export abstract class EditFragmentServiceBase {
  protected store?: EditFragmentStoreApi;

  constructor(
    private _itemService: ItemService,
    private _thesaurusService: ThesaurusService
  ) {}

  /**
   * Load into the state the fragment with the specified ID
   * and its thesauri.
   *
   * @param partId The ID of the part the fragment belongs to.
   * @param loc The fragment's location.
   * @param thesauriIds The thesauri IDs array, or null.
   */
  public load(
    partId: string,
    loc: string,
    thesauriIds: string[] | null = null
  ): void {
    if (!this.store) {
      return;
    }
    // signal that we're loading
    this.store.setLoading(true);

    // if thesauri are required:
    if (thesauriIds) {
      // remove trailing ! from IDs if any
      const unscopedIds = thesauriIds.map((id) => {
        return this._thesaurusService.getScopedId(id);
      });

      // fetch fragment and thesauri
      forkJoin({
        part: this._itemService.getPart(partId),
        thesauri: this._thesaurusService.getThesauriSet(unscopedIds),
      }).subscribe((result) => {
        // loading has ended
        this.store!.setLoading(false);

        const layerPart = result.part as TextLayerPart;
        const fr = layerPart.fragments.find((f) => f.location === loc);
        if (!fr) {
          // not found: new fragment
          this.store!.update({
            fragment: {
              location: loc,
            },
            thesauri: result.thesauri,
            loading: false,
            error: null,
          });
        } else {
          // found: existing fragment
          this.store!.update({
            fragment: fr,
            thesauri: result.thesauri,
            loading: false,
            error: null,
          });
        }
        // if the loaded layer part has a thesaurus scope, reload the thesauri
        if (result.part?.thesaurusScope) {
          const scopedIds = thesauriIds.map((id) => {
            return this._thesaurusService.getScopedId(
              id,
              result.part?.thesaurusScope
            );
          });
          // loading again
          this.store!.setLoading(true);
          this._thesaurusService.getThesauriSet(scopedIds).subscribe(
            (thesauri) => {
              // completed, replace the thesauri
              this.store!.update({
                thesauri,
                loading: false
              });
            },
            (error) => {
              console.error(error);
              this.store!.setLoading(false);
              this.store!.setError(
                'Error loading thesauri ' + scopedIds.join(', ')
              );
            }
          );
        } // scoped
      });
    } else {
      // without thesauri to be fetched, just fetch the part
      this._itemService.getPart(partId).subscribe(
        (part) => {
          const layerPart = part as TextLayerPart;
          const fr = layerPart.fragments.find((f) => f.location === loc);
          if (!fr) {
            // not found: new fragment
            this.store!.update({
              fragment: {
                location: loc,
              },
              loading: false,
              error: null,
            });
          } else {
            this.store!.update({
              fragment: fr,
              loading: false,
              error: null,
            });
          }
        },
        (error) => {
          console.error(error);
          this.store!.setLoading(false);
          this.store!.setError('Error loading fragment\'s part ' + partId);
        }
      );
    }
  }

  /**
   * Save the fragments in their layer part.
   *
   * @param part The part.
   * @returns Promise which when successful returns the
   * saved part (which contains the fragment being saved).
   */
  public save(part: Part): Promise<Part> {
    this.store!.setSaving(true);
    this.store!.setDirty(true);

    return new Promise((resolve, reject) => {
      this._itemService.addPart(part).subscribe(
        (saved: Part) => {
          this.store!.update({
            part: saved,
            saving: false,
            dirty: false,
            error: null,
          });
          resolve(part);
        },
        (error) => {
          console.error(error);
          this.store!.setSaving(false);
          this.store!.setError('Error saving fragment\'s part');
          reject(error);
        }
      );
    });
  }

  public setDirty(value = true): void {
    this.store!.setDirty(value);
  }
}
