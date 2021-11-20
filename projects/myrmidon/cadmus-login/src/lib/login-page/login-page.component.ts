import { Component, OnInit } from '@angular/core';
import { Credentials } from '@myrmidon/cadmus-ui';
import { Observable } from 'rxjs';

import { LoginService } from '../services/login.service';
import { AuthQuery } from '../state/auth.query';

@Component({
  selector: 'cadmus-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
})
export class LoginPageComponent implements OnInit {
  public validating$: Observable<boolean>;
  public error$: Observable<string>;

  constructor(
    private _authQuery: AuthQuery,
    private _loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.validating$ = this._authQuery.validating$;
    this.error$ = this._authQuery.error$;
  }

  public onSubmit(credentials: Credentials): void {
    this._loginService.login(
      credentials.name,
      credentials.password,
      credentials.returnUrl
    );
  }
}
