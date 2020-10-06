import { Injectable } from '@angular/core';
import { UtilService } from '@myrmidon/cadmus-core';
import { EditPartQueryBase } from '@myrmidon/cadmus-state';
import { EditIndexKeywordsPartStore } from './edit-index-keywords-part.store';

@Injectable({ providedIn: 'root' })
export class EditIndexKeywordsPartQuery extends EditPartQueryBase {
  constructor(store: EditIndexKeywordsPartStore, utilService: UtilService) {
    super(store, utilService);
  }
}
