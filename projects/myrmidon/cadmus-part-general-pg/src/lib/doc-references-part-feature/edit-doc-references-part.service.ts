import { Injectable } from '@angular/core';

import { ItemService, ThesaurusService } from '@myrmidon/cadmus-api';
import { EditPartServiceBase } from '@myrmidon/cadmus-state';

import { EditDocReferencesPartStore } from './edit-doc-references-part.store';

@Injectable({ providedIn: 'root' })
export class EditDocReferencesPartService extends EditPartServiceBase {
  constructor(
    editPartStore: EditDocReferencesPartStore,
    itemService: ItemService,
    thesaurusService: ThesaurusService
  ) {
    super(itemService, thesaurusService);
    this.store = editPartStore;
  }
}
