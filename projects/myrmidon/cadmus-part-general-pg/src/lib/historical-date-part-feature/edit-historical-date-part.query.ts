import { Injectable } from '@angular/core';
import { UtilService } from '@myrmidon/cadmus-core';
import { EditPartQueryBase } from '@myrmidon/cadmus-state';
import { EditHistoricalDatePartStore } from './edit-historical-date-part.store';

@Injectable({ providedIn: 'root' })
export class EditHistoricalDatePartQuery extends EditPartQueryBase {
  constructor(store: EditHistoricalDatePartStore, utilService: UtilService) {
    super(store, utilService);
  }
}
