import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  EditItemQuery,
  EditItemService,
  EditPartFeatureBase,
} from '@myrmidon/cadmus-state';

import { EditCommentPartService } from './edit-comment-part.service';
import { EditCommentPartQuery } from './edit-comment-part.query';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'cadmus-comment-part-feature',
  templateUrl: './comment-part-feature.component.html',
  styleUrls: ['./comment-part-feature.component.css'],
})
export class CommentPartFeatureComponent
  extends EditPartFeatureBase
  implements OnInit {
  constructor(
    router: Router,
    route: ActivatedRoute,
    snackbar: MatSnackBar,
    editPartQuery: EditCommentPartQuery,
    editPartService: EditCommentPartService,
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
    this.initEditor([
      'comment-tags',
      'doc-reference-tags',
      'categories',
      'languages',
      'keyword-indexes',
      'keyword-tags',
    ]);
  }
}
