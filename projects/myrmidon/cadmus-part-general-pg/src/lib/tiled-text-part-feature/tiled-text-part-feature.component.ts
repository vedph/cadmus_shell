import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import {
  EditItemQuery,
  EditItemService,
  EditPartFeatureBase,
} from '@myrmidon/cadmus-state';

import { EditTiledTextPartService } from './edit-tiled-text-part.service';
import { EditTiledTextPartQuery } from './edit-tiled-text-part.query';

@Component({
  selector: 'cadmus-tiled-text-part-feature',
  templateUrl: './tiled-text-part-feature.component.html',
  styleUrls: ['./tiled-text-part-feature.component.css'],
})
export class TiledTextPartFeatureComponent
  extends EditPartFeatureBase
  implements OnInit
{
  constructor(
    router: Router,
    route: ActivatedRoute,
    snackbar: MatSnackBar,
    editPartQuery: EditTiledTextPartQuery,
    editPartService: EditTiledTextPartService,
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
    this.initEditor();
  }
}
