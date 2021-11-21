import { Injectable } from '@angular/core';
import { forkJoin } from 'rxjs';

import {
  FacetService,
  FlagService,
  ThesaurusService,
} from '@myrmidon/cadmus-api';

import { AppStore } from './app.store';

@Injectable({ providedIn: 'root' })
export class AppService {
  constructor(
    private _store: AppStore,
    private _facetService: FacetService,
    private _flagService: FlagService,
    private _thesaurusService: ThesaurusService
  ) {}

  public load(): void {
    this._store.setLoading(true);

    const facets$ = this._facetService.getFacets();
    const flags$ = this._flagService.getFlags();
    const thesauri$ = this._thesaurusService.getThesauriSet([
      'model-types@en',
      'item-browsers@en',
    ]);

    forkJoin([facets$, flags$, thesauri$]).subscribe(
      ([facets, flags, thesauri]) => {
        this._store.setLoading(false);
        this._store.setError(null);

        this._store.update({
          facets,
          flags,
          typeThesaurus: thesauri['model-types'],
          itemBrowserThesaurus: thesauri['item-browsers'],
        });
      },
      (error) => {
        console.error(error);
        this._store.setLoading(false);
        this._store.setError('Error loading app state');
      }
    );
  }
}
