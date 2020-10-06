import { StoreConfig, EntityStore, EntityState } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { ItemInfo } from '@myrmidon/cadmus-core';

export interface ItemsState extends EntityState<ItemInfo, string> {
}

const initialState = {
};

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'items' })
export class ItemsStore extends EntityStore<ItemsState> {
  constructor() {
    super(initialState);
  }
}
