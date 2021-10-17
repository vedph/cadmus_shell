import { TestBed } from '@angular/core/testing';

import { ApparatusEntrySummaryService } from './apparatus-entry-summary.service';

describe('ApparatusEntrySummaryService', () => {
  let service: ApparatusEntrySummaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApparatusEntrySummaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
