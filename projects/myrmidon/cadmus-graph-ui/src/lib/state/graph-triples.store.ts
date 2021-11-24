import { StoreConfig, EntityStore, EntityState } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { TripleFilter, TripleResult } from '@myrmidon/cadmus-api';

export interface GraphTriplesState extends EntityState<TripleResult, number> {
  filter: TripleFilter;
}

const initialState: GraphTriplesState = {
  filter: {
    pageNumber: 1,
    pageSize: 20,
  },
};

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'GraphTriples' })
export class GraphTriplesStore extends EntityStore<GraphTriplesState> {
  constructor() {
    super(initialState);
  }
}
