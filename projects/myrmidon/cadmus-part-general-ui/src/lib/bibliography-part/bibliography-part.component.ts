import { Component, OnInit } from '@angular/core';
import {
  BibliographyPart,
  BibEntry,
  BIBLIOGRAPHY_PART_TYPEID,
  BibAuthor
} from '../bibliography-part';
import { ModelEditorComponentBase, DialogService } from '@myrmidon/cadmus-ui';
import { deepCopy, Thesaurus } from '@myrmidon/cadmus-core';
import { AuthService } from '@myrmidon/cadmus-api';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

/**
 * Bibliography part editor.
 * Thesauri: languages, bibliography-types (optional),
 * bibliography-author-roles (optional).
 */
@Component({
  selector: 'cadmus-bibliography-part',
  templateUrl: './bibliography-part.component.html',
  styleUrls: ['./bibliography-part.component.css']
})
export class BibliographyPartComponent
  extends ModelEditorComponentBase<BibliographyPart>
  implements OnInit {
  private _newEditedEntry: boolean;

  public part: BibliographyPart;
  public editedEntry: BibEntry;
  public currentTabIndex: number;

  public typeThesaurus: Thesaurus;
  public langThesaurus: Thesaurus;
  public roleThesaurus: Thesaurus;

  public entryCount: FormControl;

  constructor(
    authService: AuthService,
    formBuilder: FormBuilder,
    private _dialogService: DialogService
  ) {
    super(authService);
    // form
    this.entryCount = formBuilder.control(0, Validators.min(1));

    this.form = formBuilder.group({
      entryCount: this.entryCount
    });
  }

  ngOnInit(): void {
    this.initEditor();
  }

  protected onThesauriSet(): void {
    const langKey = 'languages';
    if (this.thesauri && this.thesauri[langKey]) {
      this.langThesaurus = this.thesauri[langKey];
    } else {
      this.langThesaurus = null;
    }

    const typeKey = 'bibliography-types';
    if (this.thesauri && this.thesauri[typeKey]) {
      this.typeThesaurus = this.thesauri[typeKey];
    } else {
      this.typeThesaurus = null;
    }

    const roleKey = 'bibliography-author-roles';
    if (this.thesauri && this.thesauri[roleKey]) {
      this.roleThesaurus = this.thesauri[roleKey];
    } else {
      this.roleThesaurus = null;
    }
  }

  private updateForm(model: BibliographyPart): void {
    if (!model) {
      this.form.reset();
      return;
    }
    this.part = model;
    this.entryCount.setValue(model.entries?.length || 0);
    this.form.markAsPristine();
  }

  protected onModelSet(model: BibliographyPart): void {
    this.updateForm(deepCopy(model));
  }

  protected getModelFromForm(): BibliographyPart {
    let part = this.model;
    if (!part) {
      part = {
        itemId: this.itemId,
        id: null,
        typeId: BIBLIOGRAPHY_PART_TYPEID,
        roleId: this.roleId,
        timeCreated: new Date(),
        creatorId: null,
        timeModified: new Date(),
        userId: null,
        entries: []
      };
    }
    part.entries = this.part.entries;
    return part;
  }

  public addEntry(): void {
    const entry: BibEntry = {
      typeId: this.typeThesaurus?.entries[0].id,
      title: null,
      language: this.langThesaurus?.entries[0].id
    };
    this.part.entries.push(entry);
    this.entryCount.setValue(this.part.entries.length);
    this._newEditedEntry = true;
    this.editEntry(entry);
  }

  public editEntry(entry: BibEntry): void {
    this.editedEntry = entry;
    this.currentTabIndex = 1;
  }

  public onEntrySave(entry: BibEntry): void {
    this._newEditedEntry = false;
    const i = this.part.entries.indexOf(this.editedEntry);
    this.part.entries.splice(i, 1, entry);
    this.currentTabIndex = 0;
    this.editedEntry = null;
    this.form.markAsDirty();
  }

  public onEntryClose(entry: BibEntry): void {
    if (this._newEditedEntry) {
      const index = this.part.entries.indexOf(this.editedEntry);
      this.part.entries.splice(index, 1);
      this.entryCount.setValue(this.part.entries.length);
    }
    this.currentTabIndex = 0;
    this.editedEntry = null;
  }

  public removeEntry(index: number): void {
    this._dialogService
      .confirm('Confirm Deletion', 'Delete entry?')
      .subscribe(result => {
        if (!result) {
          return;
        }
        this.part.entries.splice(index, 1);
        this.entryCount.setValue(this.part.entries.length);
        this.form.markAsDirty();
      });
  }

  public moveEntryUp(index: number): void {
    if (index < 1) {
      return;
    }
    const entry = this.part.entries[index];
    this.part.entries.splice(index, 1);
    this.part.entries.splice(index - 1, 0, entry);
    this.form.markAsDirty();
  }

  public moveEntryDown(index: number): void {
    if (index + 1 >= this.part.entries.length) {
      return;
    }
    const item = this.part.entries[index];
    this.part.entries.splice(index, 1);
    this.part.entries.splice(index + 1, 0, item);
    this.form.markAsDirty();
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
        sb.push(authors[i].firstName);
      }
      if (authors[i].roleId) {
        sb.push(` (${authors[i].roleId})`);
      }
    }
    return sb.join('');
  }
}
