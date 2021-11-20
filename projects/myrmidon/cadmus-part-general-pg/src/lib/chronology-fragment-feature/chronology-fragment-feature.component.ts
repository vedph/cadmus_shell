import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import {
  EditItemQuery,
  EditItemService,
  EditLayerPartQuery,
  EditLayerPartService,
  EditFragmentFeatureBase,
} from '@myrmidon/cadmus-state';
import { LibraryRouteService } from '@myrmidon/cadmus-core';

import { EditChronologyFragmentQuery } from './edit-chronology-fragment.query';
import { EditChronologyFragmentService } from './edit-chronology-fragment.service';

@Component({
  selector: 'cadmus-chronology-fragment-feature',
  templateUrl: './chronology-fragment-feature.component.html',
  styleUrls: ['./chronology-fragment-feature.component.css'],
})
export class ChronologyFragmentFeatureComponent
  extends EditFragmentFeatureBase
  implements OnInit
{
  constructor(
    router: Router,
    route: ActivatedRoute,
    snackbar: MatSnackBar,
    editFrQuery: EditChronologyFragmentQuery,
    editFrService: EditChronologyFragmentService,
    editItemQuery: EditItemQuery,
    editItemService: EditItemService,
    editLayersQuery: EditLayerPartQuery,
    editLayersService: EditLayerPartService,
    libraryRouteService: LibraryRouteService
  ) {
    super(
      router,
      route,
      snackbar,
      editFrQuery,
      editFrService,
      editItemQuery,
      editItemService,
      editLayersQuery,
      editLayersService,
      libraryRouteService
    );
  }

  ngOnInit(): void {
    this.initEditor(['chronology-tags']);
  }
}
