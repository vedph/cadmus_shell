import { StoreConfig, Store } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { EditPartState, EditPartStoreApi } from '@myrmidon/cadmus-state';
import { CATEGORIES_PART_TYPEID } from '@myrmidon/cadmus-part-general-ui';

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: CATEGORIES_PART_TYPEID })
export class EditCategoriesPartStore
  extends Store<EditPartState>
  implements EditPartStoreApi
{
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
