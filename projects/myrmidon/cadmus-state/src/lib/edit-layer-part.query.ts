import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Query } from '@datorama/akita';

import { LayerHint } from '@myrmidon/cadmus-core';

import {
  EditLayerPartState,
  EditLayerPartStore,
} from './edit-layer-part.store';

@Injectable({ providedIn: 'root' })
export class EditLayerPartQuery extends Query<EditLayerPartState> {
  constructor(protected store: EditLayerPartStore) {
    super(store);
  }

  public selectDeletingFragment(): Observable<boolean | undefined> {
    return this.select((state) => state.deletingFragment);
  }

  public selectSavingFragment(): Observable<boolean | undefined> {
    return this.select((state) => state.savingFragment);
  }

  public selectRefreshingBreakChance(): Observable<boolean | undefined> {
    return this.select((state) => state.refreshingBreakChance);
  }

  public selectBreakChance(): Observable<number> {
    return this.select((state) => state.breakChance);
  }

  public selectLayerHints(): Observable<LayerHint[]> {
    return this.select((state) => state.layerHints);
  }

  public selectPatchingLayers(): Observable<boolean | undefined> {
    return this.select((state) => state.patchingLayer);
  }
}
