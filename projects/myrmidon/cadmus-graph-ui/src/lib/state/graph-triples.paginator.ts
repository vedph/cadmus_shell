import { inject, InjectionToken } from '@angular/core';
import { PaginatorPlugin } from '@datorama/akita';
import { GraphTriplesQuery } from './graph-triples.query';

// create a factory provider for the paginator
export const GRAPH_TRIPLES_PAGINATOR = new InjectionToken(
  'GRAPH_TRIPLES_PAGINATOR',
  {
    providedIn: 'root',
    factory: () => {
      const query = inject(GraphTriplesQuery);
      return new PaginatorPlugin(query).withControls().withRange();
    },
  }
);
