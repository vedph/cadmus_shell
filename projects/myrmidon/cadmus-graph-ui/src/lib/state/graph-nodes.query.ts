import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { Observable } from 'rxjs';
import { NodeFilter, NodeResult } from '@myrmidon/cadmus-api';

import { GraphNodesState, GraphNodesStore } from './graph-nodes.store';

@Injectable({ providedIn: 'root' })
export class GraphNodesQuery extends QueryEntity<GraphNodesState> {
  constructor(store: GraphNodesStore) {
    super(store);
  }

  public selectFilter(): Observable<NodeFilter> {
    return this.select((state) => state.filter);
  }

  public getFilter(): NodeFilter {
    return this.getValue().filter;
  }

  public selectLinkedNode(): Observable<NodeResult | undefined> {
    return this.select((state) => state.linkedNode);
  }

  public getLinkedNode(): NodeResult | undefined {
    return this.getValue().linkedNode;
  }

  public selectClassNodes(): Observable<NodeResult[] | undefined> {
    return this.select((state) => state.classNodes);
  }

  public getClassNodes(): NodeResult[] | undefined {
    return this.getValue().classNodes;
  }
}
