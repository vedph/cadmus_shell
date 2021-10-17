import { Component, OnInit } from '@angular/core';
import { ApparatusFragment } from '../apparatus-fragment';
import { AuthService } from '@myrmidon/cadmus-api';
import { ModelEditorComponentBase, DialogService } from '@myrmidon/cadmus-ui';
import { ApparatusEntryType, ApparatusEntry } from '../apparatus-fragment';
import {
  FormControl,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';
import { deepCopy, ThesaurusEntry } from '@myrmidon/cadmus-core';
import { ApparatusEntrySummaryService } from './apparatus-entry-summary.service';

/**
 * Critical apparatus fragment.
 * Thesauri: apparatus-tags, apparatus-witnesses, apparatus-authors,
 * apparatus-author-tags, author-works.
 */
@Component({
  selector: 'cadmus-apparatus-fragment',
  templateUrl: './apparatus-fragment.component.html',
  styleUrls: ['./apparatus-fragment.component.css'],
})
export class ApparatusFragmentComponent
  extends ModelEditorComponentBase<ApparatusFragment>
  implements OnInit {
  private _newEditedEntry: boolean;

  public editedEntry: ApparatusEntry;
  public currentTabIndex: number;

  public tag: FormControl;
  public entryCount: FormControl;
  public form: FormGroup;

  public tagEntries: ThesaurusEntry[] | undefined;
  public witEntries: ThesaurusEntry[] | undefined;
  public authEntries: ThesaurusEntry[] | undefined;
  public authTagEntries: ThesaurusEntry[] | undefined;
  /**
   * Author/work tags. This can be alternative or additional
   * to authEntries, and allows picking the work from a tree
   * of authors and works.
   */
  public workEntries: ThesaurusEntry[] | undefined;

  public entries: ApparatusEntry[];
  public summary?: string;

  constructor(
    authService: AuthService,
    formBuilder: FormBuilder,
    private _dialogService: DialogService,
    private _summaryService: ApparatusEntrySummaryService
  ) {
    super(authService);
    this.entries = [];
    // form
    this.tag = formBuilder.control(null, Validators.maxLength(50));
    this.entryCount = formBuilder.control(0, Validators.min(1));
    this.form = formBuilder.group({
      tag: this.tag,
      entryCount: this.entryCount,
    });
    this.currentTabIndex = 0;
  }

  ngOnInit(): void {
    this.initEditor();
  }

  protected onThesauriSet(): void {
    let key = 'apparatus-tags';
    if (this.thesauri && this.thesauri[key]) {
      this.tagEntries = this.thesauri[key].entries;
    } else {
      this.tagEntries = undefined;
    }

    key = 'apparatus-witnesses';
    if (this.thesauri && this.thesauri[key]) {
      this.witEntries = this.thesauri[key].entries;
    } else {
      this.witEntries = undefined;
    }

    key = 'apparatus-authors';
    if (this.thesauri && this.thesauri[key]) {
      this.authEntries = this.thesauri[key].entries;
    } else {
      this.authEntries = undefined;
    }

    key = 'apparatus-author-tags';
    if (this.thesauri && this.thesauri[key]) {
      this.authTagEntries = this.thesauri[key].entries;
    } else {
      this.authTagEntries = undefined;
    }

    key = 'author-works';
    if (this.thesauri && this.thesauri[key]) {
      this.workEntries = this.thesauri[key].entries;
    } else {
      this.workEntries = undefined;
    }
  }

  private updateForm(model: ApparatusFragment): void {
    this.summary = this._summaryService.build(model);
    if (!model) {
      this.form.reset();
      return;
    }
    this.tag.setValue(model.tag);
    this.entries = model.entries || [];
    this.entryCount.setValue(model.entries?.length || 0);
    this.form.markAsPristine();
  }

  protected onModelSet(model: ApparatusFragment): void {
    this.updateForm(deepCopy(model));
  }

  protected getModelFromForm(): ApparatusFragment {
    return {
      location: this.model?.location ?? '',
      tag: this.tag.value?.trim(),
      entries: this.entries,
    };
  }

  public getEntryTypeDsc(type: number): string {
    switch (type) {
      case 1:
        return 'Addition before';
      case 2:
        return 'Addition after';
      case 3:
        return 'Note';
      default:
        return 'Replacement';
    }
  }

  public getEntryTypeIcon(type: number): string {
    switch (type) {
      case 1:
        return 'skip_next';
      case 2:
        return 'skip_previous';
      case 3:
        return 'chat';
      default:
        return 'content_copy';
    }
  }

  public addEntry(): void {
    const entry = { type: ApparatusEntryType.replacement };
    if (!this.entries) {
      this.entries = [];
    }
    this.entries.push(entry);
    this.entryCount.setValue(this.entries.length);
    this._newEditedEntry = true;
    this.summary = this._summaryService.build(this.getModelFromForm());
    this.editEntry(entry);
  }

  public editEntry(entry: ApparatusEntry): void {
    this.editedEntry = entry;
    this.currentTabIndex = 1;
  }

  public onEntrySave(entry: ApparatusEntry): void {
    this._newEditedEntry = false;
    const i = this.entries.indexOf(this.editedEntry);
    this.entries.splice(i, 1, entry);
    this.currentTabIndex = 0;
    this.editedEntry = null;
    this.summary = this._summaryService.build(this.getModelFromForm());
    this.form.markAsDirty();
  }

  public onEntryClose(): void {
    if (this._newEditedEntry) {
      const index = this.entries.indexOf(this.editedEntry);
      this.entries.splice(index, 1);
      this.entryCount.setValue(this.entries.length);
    }
    this.currentTabIndex = 0;
    this.editedEntry = null;
  }

  public removeEntry(index: number): void {
    this._dialogService
      .confirm('Confirm Deletion', 'Delete entry?')
      .subscribe((result) => {
        if (!result) {
          return;
        }
        this.entries.splice(index, 1);
        this.entryCount.setValue(this.entries.length);
        this.summary = this._summaryService.build(this.getModelFromForm());
        this.form.markAsDirty();
      });
  }

  public moveEntryUp(index: number): void {
    if (index < 1) {
      return;
    }
    const entry = this.entries[index];
    this.entries.splice(index, 1);
    this.entries.splice(index - 1, 0, entry);
    this.summary = this._summaryService.build(this.getModelFromForm());
    this.form.markAsDirty();
  }

  public moveEntryDown(index: number): void {
    if (index + 1 >= this.entries.length) {
      return;
    }
    const item = this.entries[index];
    this.entries.splice(index, 1);
    this.entries.splice(index + 1, 0, item);
    this.summary = this._summaryService.build(this.getModelFromForm());
    this.form.markAsDirty();
  }
}
