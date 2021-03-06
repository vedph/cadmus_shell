import { Component, OnInit } from '@angular/core';
import { EditPartFeatureBase, EditItemQuery, EditItemService } from '@myrmidon/cadmus-state';
import { Router, ActivatedRoute } from '@angular/router';
import { EditKeywordsPartQuery } from './edit-keywords-part.query';
import { EditKeywordsPartService } from './edit-keywords-part.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'cadmus-keywords-part-feature',
  templateUrl: './keywords-part-feature.component.html',
  styleUrls: ['./keywords-part-feature.component.css']
})
export class KeywordsPartFeatureComponent extends EditPartFeatureBase
implements OnInit {
  constructor(
    router: Router,
    route: ActivatedRoute,
    snackbar: MatSnackBar,
    editPartQuery: EditKeywordsPartQuery,
    editPartService: EditKeywordsPartService,
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
    this.initEditor(['languages']);
  }
}
