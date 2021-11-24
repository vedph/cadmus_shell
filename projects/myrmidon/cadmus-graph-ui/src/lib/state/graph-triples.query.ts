import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { Observable } from 'rxjs';

import { NodeResult, TripleFilter } from '@myrmidon/cadmus-api';

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

  public selectTerm(type: 'S' | 'P' | 'O'): Observable<NodeResult | undefined> {
    return this.select((state) => {
      switch (type) {
        case 'S':
          return state.subjectNode;
        case 'P':
          return state.predicateNode;
        case 'O':
          return state.objectNode;
      }
    });
  }

  public getTerm(type: 'S' | 'P' | 'O'): NodeResult | undefined {
    switch (type) {
      case 'S':
        return this.getValue().subjectNode;
      case 'P':
        return this.getValue().predicateNode;
      case 'O':
        return this.getValue().objectNode;
    }
  }
}
