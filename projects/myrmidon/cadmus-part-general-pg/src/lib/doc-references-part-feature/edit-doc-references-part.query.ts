import { Injectable } from '@angular/core';

import { EditPartQueryBase } from '@myrmidon/cadmus-state';

import { EditDocReferencesPartStore } from './edit-doc-references-part.store';

@Injectable({ providedIn: 'root' })
export class EditDocReferencesPartQuery extends EditPartQueryBase {
  constructor(store: EditDocReferencesPartStore) {
    super(store);
  }
}
