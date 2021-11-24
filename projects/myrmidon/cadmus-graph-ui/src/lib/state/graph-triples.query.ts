import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { Observable } from 'rxjs';

import { TripleFilter } from '@myrmidon/cadmus-api';

import { GraphTriplesState, GraphTriplesStore } from './graph-triples.store';

@Injectable({ providedIn: 'root' })
export class GraphTriplesQuery extends QueryEntity<GraphTriplesState> {
  constructor(store: GraphTriplesStore) {
    super(store);
  }

  public selectFilter(): Observable<TripleFilter> {
    return this.select((state) => state.filter);
  }

  public getFilter(): TripleFilter {
    return this.getValue().filter;
  }
}
