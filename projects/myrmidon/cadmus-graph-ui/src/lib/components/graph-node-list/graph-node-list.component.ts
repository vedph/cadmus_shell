import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ViewportScroller } from '@angular/common';
import { PageEvent } from '@angular/material/paginator';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, startWith, switchMap, take, tap } from 'rxjs/operators';

import { PaginationResponse, PaginatorPlugin } from '@datorama/akita';

import {
  GraphService,
  NodeFilter,
  NodeResult,
  NodeSourceType,
} from '@myrmidon/cadmus-api';
import { DataPage, ErrorInfo } from '@myrmidon/ng-tools';
import { DialogService } from '@myrmidon/ng-mat-tools';

import { GRAPH_NODES_PAGINATOR } from '../../state/graph-nodes.paginator';
import { GraphNodesQuery } from '../../state/graph-nodes.query';
import { GraphNodesState } from '../../state/graph-nodes.store';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ThesaurusNode } from '@myrmidon/cadmus-thesaurus-ui';

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

  public editedNode?: NodeResult;

  /**
   * The optional set of thesaurus entries for node's tags.
   */
  @Input()
  public tagEntries?: ThesaurusNode[];

  constructor(
    @Inject(GRAPH_NODES_PAGINATOR)
    public paginator: PaginatorPlugin<GraphNodesState>,
    private _scroller: ViewportScroller,
    private _graphService: GraphService,
    private _dialogService: DialogService,
    private _snackbar: MatSnackBar,
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
    this.editedNode = {
      uri: '',
      id: 0,
      sourceType: NodeSourceType.User,
      label: '',
    };
  }

  public editNode(node: NodeResult): void {
    this.editedNode = node;
  }

  public onNodeChange(node: NodeResult): void {
    this._graphService
      .addNode(node)
      .pipe(take(1))
      .subscribe(
        (n) => {
          this._refresh$.next(this._refresh$.value + 1);
          this.editedNode = undefined;
          this._snackbar.open('Node saved', 'OK', {
            duration: 1500,
          });
        },
        (error) => {
          if (error) {
            console.error(JSON.stringify(error));
          }
          this._snackbar.open('Error deleting node', 'OK');
        }
      );
  }

  public onEditorClose(): void {
    this.editedNode = undefined;
  }

  public deleteNode(node: NodeResult): void {
    this._dialogService
      .confirm('Delete Node', 'Delete node ' + node.label + '?')
      .pipe(take(1))
      .subscribe((yes) => {
        if (yes) {
          this._graphService
            .deleteNode(node.id)
            .pipe(take(1))
            .subscribe(
              (_) => {
                this._refresh$.next(this._refresh$.value + 1);
              },
              (error) => {
                if (error) {
                  console.error(JSON.stringify(error));
                }
                this._snackbar.open('Error deleting node', 'OK');
              }
            );
        }
      });
  }
}
