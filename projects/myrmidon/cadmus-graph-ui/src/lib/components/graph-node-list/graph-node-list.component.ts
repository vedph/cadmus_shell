import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ViewportScroller } from '@angular/common';
import { PageEvent } from '@angular/material/paginator';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, startWith, switchMap, take, tap } from 'rxjs/operators';

import { PaginationResponse, PaginatorPlugin } from '@datorama/akita';

import { GraphService, NodeFilter, NodeResult } from '@myrmidon/cadmus-api';
import { DataPage, ErrorInfo } from '@myrmidon/ng-tools';
import { DialogService } from '@myrmidon/ng-mat-tools';

import { GRAPH_NODES_PAGINATOR } from '../../state/graph-nodes.paginator';
import { GraphNodesQuery } from '../../state/graph-nodes.query';
import { GraphNodesState } from '../../state/graph-nodes.store';

/**
 * List of graph nodes. This includes a graph node filter, a list, and a graph
 * editor.
 */
@Component({
  selector: 'cadmus-graph-node-list',
  templateUrl: './graph-node-list.component.html',
  styleUrls: ['./graph-node-list.component.css'],
})
export class GraphNodeListComponent implements OnInit, OnDestroy {
  private _refresh$: BehaviorSubject<number>;
  private _filter$: Observable<NodeFilter>;

  public loading$: Observable<boolean | undefined>;
  public error$: Observable<ErrorInfo>;
  public pagination$: Observable<PaginationResponse<NodeResult>>;
  public nodeCount$: Observable<number>;
  public pageSize: FormControl;

  constructor(
    @Inject(GRAPH_NODES_PAGINATOR)
    public paginator: PaginatorPlugin<GraphNodesState>,
    private _scroller: ViewportScroller,
    private _graphService: GraphService,
    private _dialogService: DialogService,
    graphNodesQuery: GraphNodesQuery,
    formBuilder: FormBuilder
  ) {
    this.pageSize = formBuilder.control(20);
    this._refresh$ = new BehaviorSubject(0);
    this._filter$ = graphNodesQuery.selectFilter();
    this.loading$ = graphNodesQuery.selectLoading();
    this.error$ = graphNodesQuery.selectError();
    this.nodeCount$ = graphNodesQuery.selectCount();

    this.pagination$ = combineLatest([
      this.paginator.pageChanges,
      this.pageSize.valueChanges.pipe(
        // we are required to emit at least the initial value
        // as combineLatest emits only if ALL observables have emitted
        startWith(20),
        // clear the cache when page size changes
        tap((_) => {
          this.paginator.clearCache();
        })
      ),
      this._filter$.pipe(
        // clear the cache when filters changed
        tap((_) => {
          this.paginator.clearCache();
        })
      ),
      this._refresh$.pipe(
        // clear the cache when forcing refresh
        tap((_) => {
          this.paginator.clearCache();
        })
      ),
    ]).pipe(
      // for each emitted value, combine into a filter and use it
      // to request the page from server
      switchMap(([pageNumber, pageSize, filter, refresh]) => {
        // const filter = { ...this._docsQuery.getValue().filter };
        const f = { ...filter };
        f.pageNumber = pageNumber;
        f.pageSize = pageSize;
        const request = this.getRequest(f);
        // update saved filters
        this.paginator.metadata.set('filter', f);
        return this.paginator.getPage(request);
      })
    );
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.paginator.destroy();
  }

  private getRequest(
    filter: NodeFilter
  ): () => Observable<PaginationResponse<NodeResult>> {
    return () =>
      this._graphService.getNodes(filter).pipe(
        // adapt server results to the paginator plugin
        map((p: DataPage<NodeResult>) => {
          return {
            currentPage: p.pageNumber,
            perPage: p.pageSize,
            lastPage: p.pageCount,
            data: p.items,
            total: p.total,
          };
        })
      );
  }

  public pageChange(event: PageEvent): void {
    // https://material.angular.io/components/paginator/api
    this.paginator.setPage(event.pageIndex + 1);
    if (event.pageSize !== this.pageSize.value) {
      this.pageSize.setValue(event.pageSize);
    }
  }

  public refresh(): void {
    this._refresh$.next(this._refresh$.value + 1);
  }

  public addNode(): void {
    // TODO
  }

  public deleteNode(node: NodeResult): void {
    this._dialogService
      .confirm('Delete Node', 'Delete node ' + node.label + '?')
      .pipe(take(1))
      .subscribe((yes) => {
        if (yes) {
          // TODO
        }
      });
  }
}
