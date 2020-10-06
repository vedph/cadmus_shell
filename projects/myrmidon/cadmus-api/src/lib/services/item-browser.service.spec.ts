import { TestBed } from '@angular/core/testing';

import { ItemBrowserService } from './item-browser.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { EnvServiceProvider, CadmusCoreModule } from '@myrmidon/cadmus-core';

describe('ItemBrowserService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientModule, CadmusCoreModule],
      providers: [HttpClient, EnvServiceProvider],
    })
  );
  it('should be created', () => {
    const service: ItemBrowserService = TestBed.inject(ItemBrowserService);
    expect(service).toBeTruthy();
  });
});
