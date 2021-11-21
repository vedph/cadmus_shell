import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, ThesaurusService } from '@myrmidon/cadmus-api';
import { Thesaurus, ThesaurusFilter, User } from '@myrmidon/cadmus-core';
import {
  EditThesaurusQuery,
  EditThesaurusService,
} from '@myrmidon/cadmus-state';
import { DialogService } from '@myrmidon/ng-mat-tools';
import { Observable } from 'rxjs';

@Component({
  selector: 'lib-thesaurus-editor-feature',
  templateUrl: './thesaurus-editor-feature.component.html',
  styleUrls: ['./thesaurus-editor-feature.component.css'],
})
export class ThesaurusEditorFeatureComponent implements OnInit {
  public id?: string;
  public user?: User;
  public userLevel: number;
  public loading$: Observable<boolean | undefined>;
  public saving$: Observable<boolean | undefined>;
  public error$: Observable<string | undefined>;
  public thesaurus?: Thesaurus;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _query: EditThesaurusQuery,
    private _editService: EditThesaurusService,
    private _authService: AuthService,
    public thesService: ThesaurusService,
    private _dialogService: DialogService,
    private _snackbar: MatSnackBar
  ) {
    this.id = this._route.snapshot.params['id'];
    if (this.id === 'new') {
      this.id = undefined;
    }
    this.userLevel = 0;
    this.loading$ = this._query.selectLoading();
    this.saving$ = this._query.selectSaving();
    this.error$ = this._query.selectError();
  }

  ngOnInit(): void {
    this._authService.currentUser$.subscribe((user: User | null) => {
      this.user = user ?? undefined;
      this.userLevel = this._authService.getCurrentUserLevel();
    });

    // update form whenever we get new data
    this._query.selectThesaurus().subscribe((thesaurus) => {
      this.thesaurus = thesaurus;
    });

    this._editService.load(this.id);
  }

  public wrapLookup(service: ThesaurusService) {
    return (filter?: ThesaurusFilter): Observable<string[]> => {
      return service.getThesaurusIds(filter);
    };
  }

  public onThesaurusChange(thesaurus: Thesaurus): void {
    this.thesaurus = thesaurus;
    this.save();
  }

  public cancel(): void {
    this._dialogService
      .confirm('Close', `Close thesaurus editor?`)
      .subscribe((result) => {
        if (!result) {
          return;
        }
        this._router.navigate(['/thesauri']);
      });
  }

  private doSave(): void {
    // save and reload as edited if was new
    this._editService.save(this.thesaurus!).then((saved) => {
      this._snackbar.open('Thesaurus saved', 'OK', {
        duration: 1500,
      });
      if (!this.id) {
        this.id = saved.id;
        // https://stackoverflow.com/questions/40983055/how-to-reload-the-current-route-with-the-angular-2-router
        this._router
          .navigateByUrl('/', { skipLocationChange: true })
          .then(() => {
            this._router.navigate(['/thesauri', saved.id]);
          });
      }
    });
  }

  public save(): void {
    if (this.userLevel < 3) {
      return;
    }

    // if the thesaurus is new, or its id has changed,
    // ensure that a thesaurus with that id does not already exist
    if (!this.id || this.id !== this.thesaurus!.id) {
      this.thesService
        .thesaurusExists(this.thesaurus!.id)
        .then((exists: boolean) => {
          if (exists) {
            this._snackbar.open(
              `A thesaurus with ID ${this.thesaurus!.id}\nalready exists!`,
              'OK'
            );
          } else {
            this.doSave();
          }
        });
    } else {
      this.doSave();
    }
  }
}
