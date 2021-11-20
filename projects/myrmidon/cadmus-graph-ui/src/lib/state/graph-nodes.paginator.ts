import { inject, InjectionToken } from '@angular/core';
import { PaginatorPlugin } from '@datorama/akita';
import { GraphNodesQuery } from './graph-nodes.query';

// create a factory provider for the paginator
export const GRAPH_NODES_PAGINATOR = new InjectionToken(
  'GRAPH_NODES_PAGINATOR',
  {
    providedIn: 'root',
    factory: () => {
      const query = inject(GraphNodesQuery);
      return new PaginatorPlugin(query).withControls().withRange();
    },
  }
);
