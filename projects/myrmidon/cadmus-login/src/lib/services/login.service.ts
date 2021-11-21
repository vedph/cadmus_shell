import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { AuthService } from '@myrmidon/cadmus-api';

import { AuthStore } from '../state/auth.store';

@Injectable({ providedIn: 'root' })
export class LoginService {
  constructor(
    private _authStore: AuthStore,
    private _authService: AuthService,
    private _router: Router
  ) {}

  public login(name: string, password: string, returnUrl?: string): void {
    this._authStore.update({ validating: true });

    this._authService
      .login(name, password)
      .pipe(
        catchError((error) => {
          console.error(error);
          this._authStore.error('Invalid login');
          return of(error);
        })
      )
      .subscribe((user) => {
        this._authStore.login(user);
        this._router.navigate([returnUrl || '/']);
      });
  }

  public logout(): void {
    this._authStore.logout();
    this._router.navigate(['/login']);
  }
}
