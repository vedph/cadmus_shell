import { Injectable } from '@angular/core';
import { EditPartQueryBase } from '@myrmidon/cadmus-state';
import { EditTiledTextPartStore } from './edit-tiled-text-part.store';

@Injectable({ providedIn: 'root' })
export class EditTiledTextPartQuery extends EditPartQueryBase {
  constructor(store: EditTiledTextPartStore) {
    super(store);
  }
}
