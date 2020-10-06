import { Injectable } from '@angular/core';
import { ItemService, ThesaurusService } from '@myrmidon/cadmus-api';
import { EditFragmentServiceBase } from '@myrmidon/cadmus-state';
import { EditApparatusFragmentStore } from './edit-apparatus-fragment.store';

@Injectable({ providedIn: 'root' })
export class EditApparatusFragmentService extends EditFragmentServiceBase {
  constructor(
    editPartStore: EditApparatusFragmentStore,
    itemService: ItemService,
    thesaurusService: ThesaurusService
  ) {
    super(itemService, thesaurusService);
    this.store = editPartStore;
  }
}
