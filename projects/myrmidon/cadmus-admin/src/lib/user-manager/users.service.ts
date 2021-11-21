import { Injectable } from '@angular/core';
import { UsersStore } from './users.store';
import { AccountService } from '@myrmidon/cadmus-api';
import { User } from '@myrmidon/cadmus-core';

@Injectable({ providedIn: 'root' })
export class UsersService {
  constructor(
    private _store: UsersStore,
    private _accountService: AccountService
  ) {}

  public setActive(name: string | null): void {
    this._store.setActive(name);
  }

  public updateActive(user: User): void {
    this._store.setLoading(true);

    this._accountService.updateUser(user).subscribe(
      (_) => {
        this._store.setLoading(false);
        this._store.setError(null);
        this._store.updateActive(user);
      },
      (error) => {
        console.error(error);
        this._store.setLoading(false);
        this._store.setError('Error updating user');
      }
    );
  }

  public deleteUser(name: string): Promise<boolean> {
    const promise: Promise<boolean> = new Promise((resolve, reject) => {
      this._store.setLoading(true);

      this._accountService.deleteUser(name).subscribe(
        (_) => {
          this._store.setLoading(false);
          this._store.setError(null);
          this._store.remove(name);
          resolve(true);
        },
        (error) => {
          console.error(error);
          this._store.setLoading(false);
          this._store.setError('Error deleting user');
          reject(error);
        }
      );
    });
    return promise;
  }
}
