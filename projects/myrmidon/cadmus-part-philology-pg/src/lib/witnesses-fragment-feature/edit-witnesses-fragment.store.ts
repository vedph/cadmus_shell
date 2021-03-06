import { Injectable } from '@angular/core';
import { StoreConfig, Store } from '@datorama/akita';
import {
  EditFragmentState,
  EditFragmentStoreApi,
  editFragmentInitialState
} from '@myrmidon/cadmus-state';
import { WITNESSES_FRAGMENT_TYPEID } from '@myrmidon/cadmus-part-philology-ui';

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: WITNESSES_FRAGMENT_TYPEID })
export class EditWitnessesFragmentStore extends Store<EditFragmentState>
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
