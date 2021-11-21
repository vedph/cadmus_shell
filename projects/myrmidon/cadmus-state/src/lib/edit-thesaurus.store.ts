import { Thesaurus } from '@myrmidon/cadmus-core';
import { Injectable } from '@angular/core';
import { StoreConfig, Store } from '@datorama/akita';

export interface EditThesaurusState {
  thesaurus?: Thesaurus;
  dirty?: boolean;
  saving?: boolean;
  loading?: boolean;
  error?: string;
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'edit-thesaurus', resettable: true })
export class EditThesaurusStore extends Store<EditThesaurusState> {
  constructor() {
    super({});
  }

  public setDirty(value = true): void {
    this.update({
      dirty: value,
    });
  }

  public setSaving(value = true): void {
    this.update({
      saving: value,
    });
  }
}
