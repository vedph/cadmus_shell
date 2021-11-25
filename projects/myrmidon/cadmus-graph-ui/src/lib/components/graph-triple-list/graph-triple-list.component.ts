import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ViewportScroller } from '@angular/common';
import { PageEvent } from '@angular/material/paginator';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, startWith, switchMap, take, tap } from 'rxjs/operators';

import { PaginationResponse, PaginatorPlugin } from '@datorama/akita';

import { GraphService, TripleFilter, TripleResult } from '@myrmidon/cadmus-api';
import { DataPage, ErrorInfo } from '@myrmidon/ng-tools';
import { DialogService } from '@myrmidon/ng-mat-tools';
import { ThesaurusNode } from '@myrmidon/cadmus-thesaurus-ui';

import { GRAPH_TRIPLES_PAGINATOR } from '../../state/graph-triples.paginator';
import { GraphTriplesState } from '../../state/graph-triples.store';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GraphTriplesQuery } from '../../state/graph-triples.query';

@Component({
  selector: 'cadmus-graph-triple-list',
  templateUrl: './graph-triple-list.component.html',
  styleUrls: ['./graph-triple-list.component.css'],
})
export class GraphTripleListComponent implements OnInit {
  private _refresh$: BehaviorSubject<number>;
  private _filter$: Observable<TripleFilter>;

  public loading$: Observable<boolean | undefined>;
  public error$: Observable<ErrorInfo>;
  public pagination$: Observable<PaginationResponse<TripleResult>>;
  public tripleCount$: Observable<number>;
  public pageSize: FormControl;

  public editedTriple?: TripleResult;

  /**
   * The optional set of thesaurus entries for triple's tags.
   */
  @Input()
  public tagEntries?: ThesaurusNode[];

  constructor(
    @Inject(GRAPH_TRIPLES_PAGINATOR)
    public paginator: PaginatorPlugin<GraphTriplesState>,
    private _scroller: ViewportScroller,
    private _graphService: GraphService,
    private _dialogService: DialogService,
    private _snackbar: MatSnackBar,
    graphNodesQuery: GraphTriplesQuery,
    formBuilder: FormBuilder
  ) {
    this.pageSize = formBuilder.control(20);
    this._refresh$ = new BehaviorSubject(0);
    this._filter$ = graphNodesQuery.selectFilter();
    this.loading$ = graphNodesQuery.selectLoading();
    this.error$ = graphNodesQuery.selectError();
    this.tripleCount$ = graphNodesQuery.selectCount();

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
    filter: TripleFilter
  ): () => Observable<PaginationResponse<TripleResult>> {
    return () =>
      this._graphService.getTriples(filter).pipe(
        // adapt server results to the paginator plugin
        map((p: DataPage<TripleResult>) => {
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

  public addTriple(): void {
    this.editedTriple = {
      id: 0,
      subjectId: 0,
      predicateId: 0,
      objectId: 0,
      subjectUri: '',
      predicateUri: ''
    };
  }

  public editTriple(triple: TripleResult): void {
    this.editedTriple = triple;
  }

  public onTripleChange(triple: TripleResult): void {
    this._graphService
      .addTriple(triple)
      .pipe(take(1))
      .subscribe(
        (n) => {
          this._refresh$.next(this._refresh$.value + 1);
          this.editedTriple = undefined;
          this._snackbar.open('Triple saved', 'OK', {
            duration: 1500,
          });
        },
        (error) => {
          if (error) {
            console.error(JSON.stringify(error));
          }
          this._snackbar.open('Error saving triple', 'OK');
        }
      );
  }

  public onEditorClose(): void {
    this.editedTriple = undefined;
  }

  public deleteTriple(triple: TripleResult): void {
    this._dialogService
      .confirm('Delete Triple', 'Delete triple?')
      .pipe(take(1))
      .subscribe((yes) => {
        if (yes) {
          this._graphService
            .deleteTriple(triple.id)
            .pipe(take(1))
            .subscribe(
              (_) => {
                this._refresh$.next(this._refresh$.value + 1);
              },
              (error) => {
                if (error) {
                  console.error(JSON.stringify(error));
                }
                this._snackbar.open('Error deleting triple', 'OK');
              }
            );
        }
      });
  }
}
