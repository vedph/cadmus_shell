import {
  Component,
  Inject,
  Output,
  EventEmitter,
  OnDestroy,
  Input,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';

import { PaginatorPlugin } from '@datorama/akita';

import { GRAPH_NODES_PAGINATOR } from '../../state/graph-nodes.paginator';
import { GraphNodesQuery } from '../../state/graph-nodes.query';
import { GraphNodesService } from '../../state/graph-nodes.service';
import { GraphNodesState } from '../../state/graph-nodes.store';

@Component({
  selector: 'cadmus-graph-node-list',
  templateUrl: './graph-node-list.component.html',
  styleUrls: ['./graph-node-list.component.css'],
})
export class GraphNodeListComponent implements OnInit {
  constructor(
    @Inject(GRAPH_NODES_PAGINATOR)
    public paginator: PaginatorPlugin<GraphNodesState>,
    private _graphNodesService: GraphNodesService,
    graphNodesQuery: GraphNodesQuery,
    formBuilder: FormBuilder
  ) {
    // this.error$ = graphNodesQuery.selectError();
  }

  ngOnInit(): void {}
}
