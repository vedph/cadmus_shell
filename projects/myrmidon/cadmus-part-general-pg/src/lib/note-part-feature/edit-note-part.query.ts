import { Injectable } from '@angular/core';
import { EditPartQueryBase } from '@myrmidon/cadmus-state';
import { EditNotePartStore } from './edit-note-part.store';

@Injectable({ providedIn: 'root' })
export class EditNotePartQuery extends EditPartQueryBase {
  constructor(store: EditNotePartStore) {
    super(store);
  }
}
