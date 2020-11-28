import { Injectable } from '@angular/core';
import { EditPartQueryBase } from '@myrmidon/cadmus-state';
import { EditCategoriesPartStore } from './edit-categories-part.store';

@Injectable({ providedIn: 'root' })
export class EditCategoriesPartQuery extends EditPartQueryBase {
  constructor(store: EditCategoriesPartStore) {
    super(store);
  }
}
