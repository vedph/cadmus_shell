import { Injectable } from '@angular/core';
import { ItemService, ThesaurusService } from '@myrmidon/cadmus-api';
import { EditPartServiceBase } from '@myrmidon/cadmus-state';
import { EditKeywordsPartStore } from './edit-keywords-part.store';

@Injectable({ providedIn: 'root' })
export class EditKeywordsPartService extends EditPartServiceBase {
  constructor(
    editPartStore: EditKeywordsPartStore,
    itemService: ItemService,
    thesaurusService: ThesaurusService
  ) {
    super(itemService, thesaurusService);
    this.store = editPartStore;
  }
}
