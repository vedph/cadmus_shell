import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormBuilder } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';

import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { startWith, tap, switchMap, map } from 'rxjs/operators';

import { PaginationResponse, PaginatorPlugin } from '@datorama/akita';

import {
  User,
  UserFilter,
  GravatarService,
  UserInfo,
} from '@myrmidon/cadmus-core';
import { UserService } from '@myrmidon/cadmus-api';
import { DataPage } from '@myrmidon/ng-tools';
import { DialogService } from '@myrmidon/ng-mat-tools';

import { USERS_PAGINATOR } from './users.paginator';
import { UsersState } from './users.store';
import { UsersService } from './users.service';
import { UsersQuery } from './users.query';

@Component({
  selector: 'cadmus-user-manager',
  templateUrl: './user-manager.component.html',
  styleUrls: ['./user-manager.component.css'],
})
export class UserManagerComponent implements OnInit {
  private _refresh$: BehaviorSubject<number>;

  public pagination$: Observable<PaginationResponse<UserInfo>>;
  public filter$: BehaviorSubject<UserFilter>;
  public pageSize: FormControl;
  public active$: Observable<UserInfo | undefined>;

  constructor(
    @Inject(USERS_PAGINATOR) public paginator: PaginatorPlugin<UsersState>,
    private _userService: UserService,
    private _usersService: UsersService,
    private _usersQuery: UsersQuery,
    private _dialogService: DialogService,
    private _gravatarService: GravatarService,
    formBuilder: FormBuilder
  ) {
    this._refresh$ = new BehaviorSubject(0);
    this.pageSize = formBuilder.control(20);
    // https://netbasal.com/manage-your-entities-with-akita-like-a-boss-768732f8d4d1
    this.active$ = this._usersQuery.selectActive();

    // filter
    const initialPageSize = 20;
    this.filter$ = new BehaviorSubject<UserFilter>(
      this.paginator.metadata.get('filter') || {
        pageNumber: 1,
        pageSize: initialPageSize,
      }
    );
    this.pageSize.setValue(initialPageSize);

    // combine and get latest:
    // -page number changes from paginator
    // -page size changes from control
    // -filter changes from filter (in this case, clearing the cache)
    // -refresh request (in this case, clearing the cache)
    this.pagination$ = combineLatest([
      this.paginator.pageChanges,
      this.pageSize.valueChanges.pipe(
        // we are required to emit at least the initial value
        // as combineLatest emits only if ALL observables have emitted
        startWith(initialPageSize),
        // clear the cache when page size changes
        tap((_) => {
          this.paginator.clearCache();
        })
      ),
      this.filter$.pipe(
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
      switchMap(([pageNumber, pageSize, filter]) => {
        filter.pageNumber = pageNumber;
        filter.pageSize = pageSize;
        const request = this.getRequest(filter);
        // update saved filters
        this.paginator.metadata.set('filter', filter);
        return this.paginator.getPage(request);
      })
    );
  }

  private getRequest(
    filter: UserFilter
  ): () => Observable<PaginationResponse<UserInfo>> {
    return () =>
      this._userService.getUsers(filter).pipe(
        // adapt server results to the paginator plugin
        map((p: DataPage<UserInfo>) => {
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

  ngOnInit(): void {}

  public getGravatarUrl(email: string, size = 80): string {
    return this._gravatarService.buildGravatarUrl(email, size);
  }

  public pageChanged(event: PageEvent): void {
    // https://material.angular.io/components/paginator/api
    this.paginator.setPage(event.pageIndex + 1);
    if (event.pageSize !== this.pageSize.value) {
      this.pageSize.setValue(event.pageSize);
    }
  }

  public deleteUser(user: User): void {
    this._dialogService
      .confirm('Confirm Deletion', `Delete user "${user.userName}"?`)
      .subscribe((ok: boolean) => {
        if (!ok) {
          return;
        }
        this._usersService.deleteUser(user.userName).then(
          (_) => {
            this._refresh$.next(this._refresh$.value + 1);
          },
          (_) => {
            this._refresh$.next(this._refresh$.value + 1);
          }
        );
      });
  }

  public setActiveUser(user: User): void {
    this._usersService.setActive(user.userName);
  }

  public resetActiveUser(): void {
    this._usersService.setActive(null);
  }

  public saveActiveUser(user: User): void {
    this._usersService.updateActive(user);
    this._refresh$.next(this._refresh$.value + 1);
  }
}
