import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

import { ModelEditorComponentBase } from '@myrmidon/cadmus-ui';
import { AuthService } from '@myrmidon/cadmus-api';
import { ThesaurusEntry } from '@myrmidon/cadmus-core';
import { deepCopy } from '@myrmidon/ng-tools';
import { DialogService } from '@myrmidon/ng-mat-tools';

import { QuotationWorksService } from './quotation-works.service';
import { QuotationsFragment, QuotationEntry } from '../quotations-fragment';

/**
 * Quotations fragment editor.
 * Thesauri: quotation-works (optional), quotation-tags (optional).
 */
@Component({
  selector: 'cadmus-quotations-fragment',
  templateUrl: './quotations-fragment.component.html',
  styleUrls: ['./quotations-fragment.component.css'],
})
export class QuotationsFragmentComponent
  extends ModelEditorComponentBase<QuotationsFragment>
  implements OnInit
{
  private _newEditedEntry?: boolean;

  public editedEntry?: QuotationEntry;
  public currentTabIndex: number;

  public workEntries?: ThesaurusEntry[];
  public tagEntries?: ThesaurusEntry[];
  public workDictionary?: Record<string, ThesaurusEntry[]>;

  public entryCount: FormControl;
  public entries: QuotationEntry[];

  constructor(
    authService: AuthService,
    formBuilder: FormBuilder,
    private _dialogService: DialogService,
    private _worksService: QuotationWorksService
  ) {
    super(authService);
    this.entries = [];
    this.currentTabIndex = 0;
    // form
    this.entryCount = formBuilder.control(0, Validators.min(1));

    this.form = formBuilder.group({
      entryCount: this.entryCount,
    });
  }

  ngOnInit(): void {
    this.initEditor();
  }

  protected onThesauriSet(): void {
    let key = 'quotation-works';
    if (this.thesauri && this.thesauri[key]) {
      this.workEntries = this.thesauri[key].entries;
      this.workDictionary = this._worksService.buildDictionary(
        this.workEntries || []
      );
    } else {
      this.workEntries = undefined;
      this.workDictionary = undefined;
    }

    key = 'quotation-tags';
    if (this.thesauri && this.thesauri[key]) {
      this.tagEntries = this.thesauri[key].entries;
    } else {
      this.tagEntries = undefined;
    }
  }

  private updateForm(model: QuotationsFragment): void {
    if (!model) {
      this.form!.reset();
      return;
    }
    this.entryCount.setValue(model.entries?.length || 0);
    this.form!.markAsPristine();
  }

  protected onModelSet(model: QuotationsFragment): void {
    this.updateForm(deepCopy(model));
  }

  protected getModelFromForm(): QuotationsFragment {
    return {
      location: this.model?.location ?? '',
      entries: this.entries,
    };
  }

  public getNameFromId(id: string): string {
    return this.workEntries?.find((e) => e.id === id)?.value || id;
  }

  public addEntry(): void {
    const entry: QuotationEntry = {
      author: '',
      work: '',
      citation: '',
    };
    this.entries.push(entry);
    this.entryCount.setValue(this.entries.length);
    this._newEditedEntry = true;
    this.editEntry(entry);
  }

  public editEntry(entry: QuotationEntry): void {
    this.editedEntry = entry;
    this.currentTabIndex = 1;
  }

  public onEntrySave(entry: QuotationEntry): void {
    if (!this.editedEntry) {
      return;
    }
    this._newEditedEntry = false;
    const i = this.entries.indexOf(this.editedEntry);
    this.entries.splice(i, 1, entry);
    this.currentTabIndex = 0;
    this.editedEntry = undefined;
    this.form!.markAsDirty();
  }

  public onEntryClose(entry: QuotationEntry): void {
    if (!this.editedEntry) {
      return;
    }
    if (this._newEditedEntry) {
      const index = this.entries.indexOf(this.editedEntry);
      this.entries.splice(index, 1);
      this.entryCount.setValue(this.entries.length);
    }
    this.currentTabIndex = 0;
    this.editedEntry = undefined;
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
        this.form!.markAsDirty();
      });
  }

  public moveEntryUp(index: number): void {
    if (index < 1) {
      return;
    }
    const entry = this.entries[index];
    this.entries.splice(index, 1);
    this.entries.splice(index - 1, 0, entry);
    this.form!.markAsDirty();
  }

  public moveEntryDown(index: number): void {
    if (index + 1 >= this.entries.length) {
      return;
    }
    const item = this.entries[index];
    this.entries.splice(index, 1);
    this.entries.splice(index + 1, 0, item);
    this.form!.markAsDirty();
  }
}
