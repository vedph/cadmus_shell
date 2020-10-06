import { Injectable } from '@angular/core';
import { ItemsLookupStore } from '../state/items-lookup.store';
import { FlagService, FacetService, UserService } from '@myrmidon/cadmus-api';
import { DataPage, UserInfo } from '@myrmidon/cadmus-core';

@Injectable({ providedIn: 'root' })
export class ItemsLookupService {
  constructor(
    private _facetService: FacetService,
    private _flagService: FlagService,
    private _userService: UserService,
    private _store: ItemsLookupStore
  ) {}

  private loadFacets(): void {
    this._facetService.getFacets().subscribe(
      facets => {
        this._store.update(state => {
          return {
            ...state,
            facets
          };
        });
      },
      err => {
        this._store.setError(err);
      }
    );
  }

  private loadFlags(): void {
    this._flagService.getFlags().subscribe(
      flags => {
        this._store.update(state => {
          return {
            ...state,
            flags
          };
        });
      },
      err => {
        this._store.setError(err);
      }
    );
  }

  private loadUsers(): void {
    this._userService.getAllUsers().subscribe(
      (page: DataPage<UserInfo>) => {
        this._store.update(state => {
          return {
            ...state,
            users: page.items.map(u => {
              return {
                id: u.userName,
                firstName: u.firstName,
                lastName: u.lastName
              };
            })
          };
        });
      },
      err => {
        this._store.setError(err);
      }
    );
  }

  public load(): void {
    this.loadFacets();
    this.loadFlags();
    this.loadUsers();
  }
}
