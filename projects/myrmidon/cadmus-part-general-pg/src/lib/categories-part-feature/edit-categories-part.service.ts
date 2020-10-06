import { Injectable } from '@angular/core';
import { ItemService, ThesaurusService } from '@myrmidon/cadmus-api';
import { EditCategoriesPartStore } from './edit-categories-part.store';
import { EditPartServiceBase } from '@myrmidon/cadmus-state';

@Injectable({ providedIn: 'root' })
export class EditCategoriesPartService extends EditPartServiceBase {
  constructor(
    editPartStore: EditCategoriesPartStore,
    itemService: ItemService,
    thesaurusService: ThesaurusService
  ) {
    super(itemService, thesaurusService);
    this.store = editPartStore;
  }
}
