import { Injectable } from '@angular/core';
import { ItemService, ThesaurusService } from '@myrmidon/cadmus-api';
import { EditPartServiceBase } from '@myrmidon/cadmus-state';
import { EditCommentPartStore } from './edit-comment-part.store';

@Injectable({ providedIn: 'root' })
export class EditCommentPartService extends EditPartServiceBase {
  constructor(
    editPartStore: EditCommentPartStore,
    itemService: ItemService,
    thesaurusService: ThesaurusService
  ) {
    super(itemService, thesaurusService);
    this.store = editPartStore;
  }
}
