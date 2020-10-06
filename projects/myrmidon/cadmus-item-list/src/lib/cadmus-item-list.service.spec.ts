import { TestBed } from '@angular/core/testing';

import { CadmusItemListService } from './cadmus-item-list.service';

describe('CadmusItemListService', () => {
  let service: CadmusItemListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CadmusItemListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
