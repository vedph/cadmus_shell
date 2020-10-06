import { Injectable } from '@angular/core';
import { ItemService, ThesaurusService } from '@myrmidon/cadmus-api';
import { EditNotePartStore } from './edit-note-part.store';
import { EditPartServiceBase } from '@myrmidon/cadmus-state';

@Injectable({ providedIn: 'root' })
export class EditNotePartService extends EditPartServiceBase {
  constructor(
    editPartStore: EditNotePartStore,
    itemService: ItemService,
    thesaurusService: ThesaurusService
  ) {
    super(itemService, thesaurusService);
    this.store = editPartStore;
  }
}
