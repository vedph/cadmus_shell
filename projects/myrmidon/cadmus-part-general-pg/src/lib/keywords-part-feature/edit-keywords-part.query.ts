import { Injectable } from '@angular/core';
import { EditPartQueryBase } from '@myrmidon/cadmus-state';
import { EditKeywordsPartStore } from './edit-keywords-part.store';

@Injectable({ providedIn: 'root' })
export class EditKeywordsPartQuery extends EditPartQueryBase {
  constructor(store: EditKeywordsPartStore) {
    super(store);
  }
}
