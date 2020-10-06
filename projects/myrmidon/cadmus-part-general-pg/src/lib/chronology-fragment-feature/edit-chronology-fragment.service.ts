import { Injectable } from '@angular/core';
import { ItemService, ThesaurusService } from '@myrmidon/cadmus-api';
import { EditFragmentServiceBase } from '@myrmidon/cadmus-state';
import { EditChronologyFragmentStore } from './edit-chronology-fragment.store';

@Injectable({ providedIn: 'root' })
export class EditChronologyFragmentService extends EditFragmentServiceBase {
  constructor(
    editPartStore: EditChronologyFragmentStore,
    itemService: ItemService,
    thesaurusService: ThesaurusService
  ) {
    super(itemService, thesaurusService);
    this.store = editPartStore;
  }
}
