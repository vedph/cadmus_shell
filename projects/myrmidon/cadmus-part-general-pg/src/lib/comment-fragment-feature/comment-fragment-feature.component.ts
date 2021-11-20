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

import { EditCommentFragmentQuery } from './edit-comment-fragment.query';
import { EditCommentFragmentService } from './edit-comment-fragment.service';

@Component({
  selector: 'cadmus-comment-fragment-feature',
  templateUrl: './comment-fragment-feature.component.html',
  styleUrls: ['./comment-fragment-feature.component.css'],
})
export class CommentFragmentFeatureComponent
  extends EditFragmentFeatureBase
  implements OnInit
{
  constructor(
    router: Router,
    route: ActivatedRoute,
    snackbar: MatSnackBar,
    editFrQuery: EditCommentFragmentQuery,
    editFrService: EditCommentFragmentService,
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
      'comment-tags',
      'doc-reference-tags',
      'doc-reference-types',
      'categories',
      'languages',
      'keyword-indexes',
      'keyword-tags',
    ]);
  }
}
