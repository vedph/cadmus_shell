import { TestBed } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { FlagService } from './flag.service';

describe('FlagService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [
        HttpClient,
        { provide: 'apiEndpoint', useValue: 'none' },
        { provide: 'databaseId', useValue: 'cadmus' },
      ],
    });
  });

  it('should be created', () => {
    const service: FlagService = TestBed.inject(FlagService);
    expect(service).toBeTruthy();
  });
});
