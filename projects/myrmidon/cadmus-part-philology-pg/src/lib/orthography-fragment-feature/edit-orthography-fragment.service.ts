import { Injectable } from '@angular/core';
import { ItemService, ThesaurusService } from '@myrmidon/cadmus-api';
import { EditFragmentServiceBase } from '@myrmidon/cadmus-state';
import { EditOrthographyFragmentStore } from './edit-orthography-fragment.store';

@Injectable({ providedIn: 'root' })
export class EditOrthographyFragmentService extends EditFragmentServiceBase {
  constructor(
    editPartStore: EditOrthographyFragmentStore,
    itemService: ItemService,
    thesaurusService: ThesaurusService
  ) {
    super(itemService, thesaurusService);
    this.store = editPartStore;
  }
}
