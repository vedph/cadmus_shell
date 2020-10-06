import { Injectable } from '@angular/core';
import { UtilService } from '@myrmidon/cadmus-core';
import { EditPartQueryBase } from '@myrmidon/cadmus-state';
import { EditBibliographyPartStore } from './edit-bibliography-part.store';

@Injectable({ providedIn: 'root' })
export class EditBibliographyPartQuery extends EditPartQueryBase {
  constructor(store: EditBibliographyPartStore, utilService: UtilService) {
    super(store, utilService);
  }
}
