import { TestBed } from '@angular/core/testing';

import { AccountService } from './account.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CadmusCoreModule } from '@myrmidon/cadmus-core';
import { EnvServiceProvider } from '@myrmidon/ng-tools';

describe('AccountService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientModule, CadmusCoreModule],
      providers: [HttpClient, EnvServiceProvider],
    })
  );

  it('should be created', () => {
    const service: AccountService = TestBed.inject(AccountService);
    expect(service).toBeTruthy();
  });
});
