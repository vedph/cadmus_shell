import { Injectable } from '@angular/core';
import { ItemService, ThesaurusService } from '@myrmidon/cadmus-api';
import { EditFragmentServiceBase } from '@myrmidon/cadmus-state';
import { EditWitnessesFragmentStore } from './edit-witnesses-fragment.store';

@Injectable({ providedIn: 'root' })
export class EditWitnessesFragmentService extends EditFragmentServiceBase {
  constructor(
    editPartStore: EditWitnessesFragmentStore,
    itemService: ItemService,
    thesaurusService: ThesaurusService
  ) {
    super(itemService, thesaurusService);
    this.store = editPartStore;
  }
}
