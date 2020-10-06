import { Injectable } from '@angular/core';
import { ItemService, ThesaurusService } from '@myrmidon/cadmus-api';
import { EditHistoricalDatePartStore } from './edit-historical-date-part.store';
import { EditPartServiceBase } from '@myrmidon/cadmus-state';

@Injectable({ providedIn: 'root' })
export class EditHistoricalDatePartService extends EditPartServiceBase {
  constructor(
    editPartStore: EditHistoricalDatePartStore,
    itemService: ItemService,
    thesaurusService: ThesaurusService
  ) {
    super(itemService, thesaurusService);
    this.store = editPartStore;
  }
}
