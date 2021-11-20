import { StoreConfig, EntityStore, EntityState } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { NodeFilter, NodeResult } from '@myrmidon/cadmus-api';

export interface GraphNodesState extends EntityState<NodeResult, number> {
  filter: NodeFilter;
  linkedNode?: NodeResult;
  classNodes?: NodeResult[];
}

const initialState: GraphNodesState = {
  filter: {
    pageNumber: 1,
    pageSize: 20,
  }
};

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'GraphNodes' })
export class GraphNodesStore extends EntityStore<GraphNodesState> {
  constructor() {
    super(initialState);
  }
}
