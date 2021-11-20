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

import { EditQuotationsFragmentQuery } from './edit-quotations-fragment.query';
import { EditQuotationsFragmentService } from './edit-quotations-fragment.service';

@Component({
  selector: 'cadmus-quotations-fragment-feature',
  templateUrl: './quotations-fragment-feature.component.html',
  styleUrls: ['./quotations-fragment-feature.component.css'],
})
export class QuotationsFragmentFeatureComponent
  extends EditFragmentFeatureBase
  implements OnInit
{
  constructor(
    router: Router,
    route: ActivatedRoute,
    snackbar: MatSnackBar,
    editFrQuery: EditQuotationsFragmentQuery,
    editFrService: EditQuotationsFragmentService,
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
    this.initEditor(['quotation-works', 'quotation-tags']);
  }
}
