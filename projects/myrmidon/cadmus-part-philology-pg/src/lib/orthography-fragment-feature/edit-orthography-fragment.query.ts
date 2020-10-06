import { Injectable } from '@angular/core';
import { EditFragmentQueryBase } from '@myrmidon/cadmus-state';
import { EditOrthographyFragmentStore } from './edit-orthography-fragment.store';

@Injectable({ providedIn: 'root' })
export class EditOrthographyFragmentQuery extends EditFragmentQueryBase {
  constructor(protected store: EditOrthographyFragmentStore) {
    super(store);
  }
}
