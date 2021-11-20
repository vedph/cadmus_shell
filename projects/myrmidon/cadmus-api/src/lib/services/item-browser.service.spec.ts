import { TestBed } from '@angular/core/testing';

import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CadmusCoreModule } from '@myrmidon/cadmus-core';
import { EnvServiceProvider } from '@myrmidon/ng-tools';

import { ItemBrowserService } from './item-browser.service';

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
