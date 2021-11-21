import { ThesauriSet, Part } from '@myrmidon/cadmus-core';
import { Injectable } from '@angular/core';

import { StoreConfig, Store } from '@datorama/akita';

/**
 * The state of the currently edited part, if any.
 */
export interface EditPartState {
  /**
   * The part being edited.
   */
  part?: Part;
  /**
   * All the thesauri required by the part's editor.
   */
  thesauri?: ThesauriSet;
  dirty?: boolean;
  saving?: boolean;
  loading?: boolean;
  error?: string;
}

/**
 * General-purpose edit-part store. This can be used with any part, so that
 * you should only provide your part store, query, and service (usually
 * extending EditPartServiceBase).
 */
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'edit-part' })
export class EditPartStore extends Store<EditPartState> {
  constructor() {
    super({});
  }

  public setDirty(value: boolean): void {
    this.update({ dirty: value });
  }

  public setSaving(value: boolean): void {
    this.update({ saving: value });
  }
}
