import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ThesauriSet } from '@myrmidon/cadmus-core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  EditItemQuery,
  EditItemService,
  EditPartFeatureBase,
} from '@myrmidon/cadmus-state';
import { EditTokenTextPartQuery } from './edit-token-text-part.query';
import { EditTokenTextPartService } from './edit-token-text-part.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'cadmus-token-text-part-feature',
  templateUrl: './token-text-part-feature.component.html',
  styleUrls: ['./token-text-part-feature.component.css'],
})
export class TokenTextPartFeatureComponent
  extends EditPartFeatureBase
  implements OnInit {
  public json$: Observable<string>;
  public thesauri$: Observable<ThesauriSet>;

  public itemId: string;
  public partId: string;
  public roleId: string;

  constructor(
    router: Router,
    route: ActivatedRoute,
    snackbar: MatSnackBar,
    editPartQuery: EditTokenTextPartQuery,
    editPartService: EditTokenTextPartService,
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
    this.initEditor(null);
  }
}
