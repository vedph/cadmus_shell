import { Injectable } from '@angular/core';
import { EditPartQueryBase } from '@myrmidon/cadmus-state';
import { EditTokenTextPartStore } from './edit-token-text-part.store';

@Injectable({ providedIn: 'root' })
export class EditTokenTextPartQuery extends EditPartQueryBase {
  constructor(store: EditTokenTextPartStore) {
    super(store);
  }
}
