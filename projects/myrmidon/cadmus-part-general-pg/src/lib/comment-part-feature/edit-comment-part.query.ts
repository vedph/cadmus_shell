import { Injectable } from '@angular/core';
import { EditPartQueryBase } from '@myrmidon/cadmus-state';
import { EditCommentPartStore } from './edit-comment-part.store';

@Injectable({ providedIn: 'root' })
export class EditCommentPartQuery extends EditPartQueryBase {
  constructor(store: EditCommentPartStore) {
    super(store);
  }
}
