import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  EditItemQuery,
  EditItemService,
  EditLayerPartQuery,
  EditLayerPartService,
  EditFragmentFeatureBase,
} from '@myrmidon/cadmus-state';
import { LibraryRouteService } from '@myrmidon/cadmus-core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { EditApparatusFragmentQuery } from './edit-apparatus-fragment.query';
import { EditApparatusFragmentService } from './edit-apparatus-fragment.service';

@Component({
  selector: 'cadmus-apparatus-fragment-feature',
  templateUrl: './apparatus-fragment-feature.component.html',
  styleUrls: ['./apparatus-fragment-feature.component.css'],
})
export class ApparatusFragmentFeatureComponent
  extends EditFragmentFeatureBase
  implements OnInit
{
  constructor(
    router: Router,
    route: ActivatedRoute,
    snackbar: MatSnackBar,
    editFrQuery: EditApparatusFragmentQuery,
    editFrService: EditApparatusFragmentService,
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
    this.initEditor([
      '!apparatus-tags',
      '!apparatus-author-tags',
      '!author-works',
      'apparatus-witnesses',
      'apparatus-authors',
    ]);
  }
}
