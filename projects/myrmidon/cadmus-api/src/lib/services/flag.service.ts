import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

import { FlagDefinition } from '@myrmidon/cadmus-core';
import { EnvService, ErrorService } from '@myrmidon/ng-tools';

@Injectable({ providedIn: 'root' })
export class FlagService {
  constructor(
    private _http: HttpClient,
    private _error: ErrorService,
    private _env: EnvService
  ) {}

  public getFlags(): Observable<FlagDefinition[]> {
    return this._http
      .get<FlagDefinition[]>(`${this._env.get('apiUrl')}flags`)
      .pipe(retry(3), catchError(this._error.handleError));
  }
}
