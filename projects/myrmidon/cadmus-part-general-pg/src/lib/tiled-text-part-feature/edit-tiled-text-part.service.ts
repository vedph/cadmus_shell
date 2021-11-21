import { Injectable } from '@angular/core';

import { ItemService, ThesaurusService } from '@myrmidon/cadmus-api';
import { EditPartServiceBase } from '@myrmidon/cadmus-state';

import { EditTiledTextPartStore } from './edit-tiled-text-part.store';

@Injectable({ providedIn: 'root' })
export class EditTiledTextPartService extends EditPartServiceBase {
  constructor(
    editPartStore: EditTiledTextPartStore,
    itemService: ItemService,
    thesaurusService: ThesaurusService
  ) {
    super(itemService, thesaurusService);
    this.store = editPartStore;
  }

  /**
   * Load the part, a base text part, from its item's ID.
   * This relies on the convention that every base text part should have
   * a "base-text" role ID.
   *
   * @param itemId The item's ID.
   * @param thesauriIds The optional thesauri IDs.
   */
  public loadBaseTextPart(itemId: string, thesauriIds?: string[]): void {
    // get the base text part ID from the item's ID
    this.itemService
      .getPartFromTypeAndRole(itemId, 'any', 'base-text')
      .subscribe(
        (part) => {
          this.load(part.id, thesauriIds);
        },
        (error) => {
          this.store!.setError(
            'Error retrieving base text part of item ' + itemId
          );
        }
      );
  }
}
