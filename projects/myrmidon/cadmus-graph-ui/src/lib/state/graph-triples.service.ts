import { Injectable } from '@angular/core';

import { GraphService, TripleFilter } from '@myrmidon/cadmus-api';

import { GraphTriplesStore } from './graph-Triples.store';

@Injectable({ providedIn: 'root' })
export class GraphTripleService {
  constructor(
    private _graphService: GraphService,
    private _store: GraphTriplesStore
  ) {}

  /**
   * Update the filter in the store.
   * @param filter The filter.
   */
  public updateFilter(filter: TripleFilter): void {
    this._store.update({
      filter: filter,
    });
  }
}
