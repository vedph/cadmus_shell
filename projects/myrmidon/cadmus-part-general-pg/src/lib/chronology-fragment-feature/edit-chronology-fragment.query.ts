import { Injectable } from '@angular/core';
import { EditFragmentQueryBase } from '@myrmidon/cadmus-state';
import { EditChronologyFragmentStore } from './edit-chronology-fragment.store';

@Injectable({ providedIn: 'root' })
export class EditChronologyFragmentQuery extends EditFragmentQueryBase {
  constructor(protected store: EditChronologyFragmentStore) {
    super(store);
  }
}
