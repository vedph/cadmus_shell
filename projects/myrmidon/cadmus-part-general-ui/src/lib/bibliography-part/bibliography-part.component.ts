import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

import { ModelEditorComponentBase } from '@myrmidon/cadmus-ui';
import { ThesaurusEntry } from '@myrmidon/cadmus-core';
import { AuthService } from '@myrmidon/cadmus-api';
import { DialogService } from '@myrmidon/ng-mat-tools';
import { deepCopy } from '@myrmidon/ng-tools';

import {
  BibliographyPart,
  BibEntry,
  BIBLIOGRAPHY_PART_TYPEID,
  BibAuthor,
} from '../bibliography-part';

/**
 * Bibliography part editor.
 * Thesauri: bibliography-languages, bibliography-types (optional),
 * bibliography-tags (optional), bibliography-author-roles (optional).
 */
@Component({
  selector: 'cadmus-bibliography-part',
  templateUrl: './bibliography-part.component.html',
  styleUrls: ['./bibliography-part.component.css'],
})
export class BibliographyPartComponent
  extends ModelEditorComponentBase<BibliographyPart>
  implements OnInit
{
  private _newEditedEntry?: boolean;

  public part?: BibliographyPart;
  public editedEntry?: BibEntry;
  public currentTabIndex: number;

  public typeEntries: ThesaurusEntry[] | undefined;
  public tagEntries: ThesaurusEntry[] | undefined;
  public langEntries: ThesaurusEntry[] | undefined;
  public roleEntries: ThesaurusEntry[] | undefined;

  public entryCount: FormControl;

  constructor(
    authService: AuthService,
    formBuilder: FormBuilder,
    private _dialogService: DialogService
  ) {
    super(authService);
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
    const langKey = 'bibliography-languages';
    if (this.thesauri && this.thesauri[langKey]) {
      this.langEntries = this.thesauri[langKey].entries;
    } else {
      this.langEntries = undefined;
    }

    const typeKey = 'bibliography-types';
    if (this.thesauri && this.thesauri[typeKey]) {
      this.typeEntries = this.thesauri[typeKey].entries;
    } else {
      this.typeEntries = undefined;
    }

    const tagKey = 'bibliography-tags';
    if (this.thesauri && this.thesauri[tagKey]) {
      this.tagEntries = this.thesauri[tagKey].entries;
    } else {
      this.tagEntries = undefined;
    }

    const roleKey = 'bibliography-author-roles';
    if (this.thesauri && this.thesauri[roleKey]) {
      this.roleEntries = this.thesauri[roleKey].entries;
    } else {
      this.roleEntries = undefined;
    }
  }

  public entryTypeToString(id?: string): string {
    if (!id || !this.typeEntries?.entries) {
      return '';
    }
    const entry = this.typeEntries.find((e) => e.id === id);
    return entry ? entry.value : id;
  }

  private updateForm(model: BibliographyPart): void {
    if (!model) {
      this.form!.reset();
      return;
    }
    this.part = model;
    if (!this.part.entries) {
      this.part.entries = [];
    }
    this.entryCount.setValue(this.part.entries.length);
    this.form!.markAsPristine();
  }

  protected onModelSet(model: BibliographyPart): void {
    this.updateForm(deepCopy(model));
  }

  protected getModelFromForm(): BibliographyPart {
    let part = this.model;
    if (!part) {
      part = {
        itemId: this.itemId!,
        id: '',
        typeId: BIBLIOGRAPHY_PART_TYPEID,
        roleId: this.roleId,
        timeCreated: new Date(),
        creatorId: '',
        timeModified: new Date(),
        userId: '',
        entries: [],
      };
    }
    part.entries = this.part?.entries || [];
    return part;
  }

  public addEntry(): void {
    const entry: BibEntry = {
      typeId: this.typeEntries ? this.typeEntries[0].id : '',
      title: '',
      language: this.langEntries ? this.langEntries[0].id : '',
    };
    this.part!.entries.push(entry);
    this.entryCount.setValue(this.part!.entries.length);
    this._newEditedEntry = true;
    this.editEntry(entry);
  }

  public editEntry(entry: BibEntry): void {
    this.editedEntry = entry;
    this.currentTabIndex = 1;
  }

  public onEntrySave(entry: BibEntry): void {
    if (!this.editedEntry) {
      return;
    }
    this._newEditedEntry = false;
    const i = this.part!.entries.indexOf(this.editedEntry);
    this.part!.entries.splice(i, 1, entry);
    this.currentTabIndex = 0;
    this.editedEntry = undefined;
    this.form!.markAsDirty();
  }

  public onEntryClose(entry: BibEntry): void {
    if (!this.editedEntry) {
      return;
    }
    if (this._newEditedEntry) {
      const index = this.part!.entries.indexOf(this.editedEntry);
      this.part!.entries.splice(index, 1);
      this.entryCount.setValue(this.part!.entries.length);
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
        this.part!.entries.splice(index, 1);
        this.entryCount.setValue(this.part!.entries.length);
        this.form!.markAsDirty();
      });
  }

  public moveEntryUp(index: number): void {
    if (index < 1) {
      return;
    }
    const entry = this.part!.entries[index];
    this.part!.entries.splice(index, 1);
    this.part!.entries.splice(index - 1, 0, entry);
    this.form!.markAsDirty();
  }

  public moveEntryDown(index: number): void {
    if (index + 1 >= this.part!.entries.length) {
      return;
    }
    const item = this.part!.entries[index];
    this.part!.entries.splice(index, 1);
    this.part!.entries.splice(index + 1, 0, item);
    this.form!.markAsDirty();
  }

  public getAuthors(authors: BibAuthor[]): string {
    const sb: string[] = [];
    for (let i = 0; i < authors?.length || 0; i++) {
      if (i) {
        sb.push('; ');
      }
      sb.push(authors[i].lastName);
      if (authors[i].firstName) {
        sb.push(', ');
        sb.push(authors[i].firstName!);
      }
      if (authors[i].roleId) {
        sb.push(` (${authors[i].roleId})`);
      }
    }
    return sb.join('');
  }
}
