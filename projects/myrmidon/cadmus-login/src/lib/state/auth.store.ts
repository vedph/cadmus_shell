import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { User } from '@myrmidon/cadmus-core';
import { STORAGE_AUTH_USER_KEY } from '@myrmidon/cadmus-api';

export interface AuthState {
  user?: User;
  validating?: boolean;
  error?: string;
}

export const initialState: AuthState = {
  user: localStorage.getItem(STORAGE_AUTH_USER_KEY)
    ? JSON.parse(localStorage.getItem(STORAGE_AUTH_USER_KEY)!)
    : undefined,
};

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'auth' })
export class AuthStore extends Store<AuthState> {
  constructor() {
    super(initialState);
  }

  public login(user: User): void {
    this.update({
      user,
      validating: false,
      error: undefined,
    });
  }

  public error(error: string): void {
    this.update({
      user: undefined,
      validating: false,
      error,
    });
  }

  public logout(): void {
    this.update(initialState);
  }
}
