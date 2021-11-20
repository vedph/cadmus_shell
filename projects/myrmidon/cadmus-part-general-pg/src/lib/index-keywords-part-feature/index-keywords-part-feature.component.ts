import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import {
  EditPartFeatureBase,
  EditItemQuery,
  EditItemService,
} from '@myrmidon/cadmus-state';

import { EditIndexKeywordsPartQuery } from './edit-index-keywords-part.query';
import { EditIndexKeywordsPartService } from './edit-index-keywords-part.service';

@Component({
  selector: 'cadmus-index-keywords-part-feature',
  templateUrl: './index-keywords-part-feature.component.html',
  styleUrls: ['./index-keywords-part-feature.component.css'],
})
export class IndexKeywordsPartFeatureComponent
  extends EditPartFeatureBase
  implements OnInit
{
  constructor(
    router: Router,
    route: ActivatedRoute,
    snackbar: MatSnackBar,
    editPartQuery: EditIndexKeywordsPartQuery,
    editPartService: EditIndexKeywordsPartService,
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

  ngOnInit(): void {
    this.initEditor(['languages', 'keyword-indexes', 'keyword-tags']);
  }
}
