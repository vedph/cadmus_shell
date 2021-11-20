import { TestBed } from '@angular/core/testing';
import { EnvServiceProvider } from '@myrmidon/ng-tools';

import { LibraryRouteService } from './library-route.service';

describe('LibraryRouteServiceService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        EnvServiceProvider,
        {
          provide: 'partEditorKeys',
          useValue: {},
        },
      ],
    })
  );

  it('should be created', () => {
    const service: LibraryRouteService = TestBed.inject(LibraryRouteService);
    expect(service).toBeTruthy();
  });
});
