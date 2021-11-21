import { StoreConfig, Store } from '@datorama/akita';
import {
  Item,
  PartGroup,
  FacetDefinition,
  LayerPartInfo,
  Part,
} from '@myrmidon/cadmus-core';
import { Injectable } from '@angular/core';

/**
 * The state of the currently edited item, if any.
 * This state is set when editing a single item, or any of its parts or
 * part fragments. The app ensures that a new item has been saved before
 * users can edit their parts, so this grants that the edit state is always
 * available when editing parts/fragments.
 * Note that as for any other state, properties "loading" and "error" are
 * implemented inside Akita states, but you must explicitly add the keys
 * to your state (it's an opt-in: see https://github.com/datorama/akita/issues/61).
 */
export interface EditItemState {
  /**
   * The item being edited.
   */
  item?: Item;
  /**
   * The raw list of item's parts.
   */
  parts?: Part[];
  /**
   * The item's parts, grouped.
   */
  partGroups?: PartGroup[];
  /**
   * The set of all the possible layer parts for this item, either
   * present or absent.
   */
  layerPartInfos?: LayerPartInfo[];
  /**
   * The facet definition assigned to the item.
   */
  facet?: FacetDefinition;

  dirty?: boolean;
  saving?: boolean;
  deletingPart?: boolean;
  loading?: boolean;
  error?: string;
}

const initialState: EditItemState = {
  parts: [],
  partGroups: [],
  layerPartInfos: [],
};

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'edit-item', resettable: true })
export class EditItemStore extends Store<EditItemState> {
  constructor() {
    super(initialState);
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

  public setDeletingPart(value = true): void {
    this.update({
      deletingPart: value,
    });
  }
}
