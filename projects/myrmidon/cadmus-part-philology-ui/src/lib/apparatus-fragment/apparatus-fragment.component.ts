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
import { Thesaurus, deepCopy } from '@myrmidon/cadmus-core';

/**
 * Critical apparatus fragment.
 * Thesauri: apparatus-tags, apparatus-witnesses, apparatus-authors.
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

  public tagThesaurus: Thesaurus;
  public witnessThesaurus: Thesaurus;
  public authorThesaurus: Thesaurus;

  public entries: ApparatusEntry[];

  constructor(
    authService: AuthService,
    formBuilder: FormBuilder,
    private _dialogService: DialogService
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

  private getThesaurus(key: string): Thesaurus {
    if (this.thesauri && this.thesauri[key]) {
      return this.thesauri[key];
    }
    return null;
  }

  protected onThesauriSet(): void {
    this.tagThesaurus = this.getThesaurus('apparatus-tags');
    this.witnessThesaurus = this.getThesaurus('apparatus-witnesses');
    this.authorThesaurus = this.getThesaurus('apparatus-authors');
  }

  private updateForm(model: ApparatusFragment): void {
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
    this.form.markAsDirty();
  }

  public moveEntryDown(index: number): void {
    if (index + 1 >= this.entries.length) {
      return;
    }
    const item = this.entries[index];
    this.entries.splice(index, 1);
    this.entries.splice(index + 1, 0, item);
    this.form.markAsDirty();
  }
}
