import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  EditItemQuery,
  EditItemService,
  EditPartFeatureBase,
} from '@myrmidon/cadmus-state';

import { EditDocReferencesPartService } from './edit-doc-references-part.service';
import { EditDocReferencesPartQuery } from './edit-doc-references-part.query';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'cadmus-doc-references-part-feature',
  templateUrl: './doc-references-part-feature.component.html',
  styleUrls: ['./doc-references-part-feature.component.css'],
})
export class DocReferencesPartFeatureComponent
  extends EditPartFeatureBase
  implements OnInit {
  constructor(
    router: Router,
    route: ActivatedRoute,
    snackbar: MatSnackBar,
    editPartQuery: EditDocReferencesPartQuery,
    editPartService: EditDocReferencesPartService,
    editItemQuery: EditItemQuery,
    editItemService: EditItemService
  ) {
    super(
      router,
      route,
      snackbar,
      editPartQuery,
      editPartService,
      editItemQuery,
      editItemService
    );
  }

  public ngOnInit(): void {
    this.initEditor(['doc-reference-tags']);
  }
}
