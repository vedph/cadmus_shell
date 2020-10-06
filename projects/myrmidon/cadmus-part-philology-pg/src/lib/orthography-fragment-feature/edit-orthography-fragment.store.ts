import { Injectable } from '@angular/core';
import { StoreConfig, Store } from '@datorama/akita';
import {
  EditFragmentState,
  EditFragmentStoreApi,
  editFragmentInitialState
} from '@myrmidon/cadmus-state';
import { ORTHOGRAPHY_FRAGMENT_TYPEID } from '@myrmidon/cadmus-part-philology-ui';

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: ORTHOGRAPHY_FRAGMENT_TYPEID })
export class EditOrthographyFragmentStore extends Store<EditFragmentState>
  implements EditFragmentStoreApi {
  constructor() {
    super(editFragmentInitialState);
  }

  public setDirty(value: boolean): void {
    this.update({ dirty: value });
  }
  public setSaving(value: boolean): void {
    this.update({ saving: value });
  }
}
