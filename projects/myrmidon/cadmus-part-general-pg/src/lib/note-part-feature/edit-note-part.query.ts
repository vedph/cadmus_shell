import { Injectable } from '@angular/core';
import { UtilService } from '@myrmidon/cadmus-core';
import { EditPartQueryBase } from '@myrmidon/cadmus-state';
import { EditNotePartStore } from './edit-note-part.store';

@Injectable({ providedIn: 'root' })
export class EditNotePartQuery extends EditPartQueryBase {
  constructor(store: EditNotePartStore, utilService: UtilService) {
    super(store, utilService);
  }
}
