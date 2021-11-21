import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

import { ModelEditorComponentBase } from '@myrmidon/cadmus-ui';
import { AuthService } from '@myrmidon/cadmus-api';
import { ThesaurusEntry } from '@myrmidon/cadmus-core';
import { deepCopy } from '@myrmidon/ng-tools';
import { renderLabelFromLastColon } from '@myrmidon/cadmus-ui';

import { CategoriesPart, CATEGORIES_PART_TYPEID } from '../categories-part';

/**
 * Categories component editor.
 * Thesaurus: categories (required).
 */
@Component({
  selector: 'cadmus-categories-part',
  templateUrl: './categories-part.component.html',
  styleUrls: ['./categories-part.component.css'],
})
export class CategoriesPartComponent
  extends ModelEditorComponentBase<CategoriesPart>
  implements OnInit
{
  public categories: FormControl;
  public entries$: BehaviorSubject<ThesaurusEntry[]>;

  constructor(authService: AuthService, formBuilder: FormBuilder) {
    super(authService);
    this.entries$ = new BehaviorSubject<ThesaurusEntry[]>([]);
    // form
    this.categories = formBuilder.control([], Validators.required);
    this.form = formBuilder.group({
      categories: this.categories,
    });
  }

  ngOnInit(): void {
    this.initEditor();
  }

  private updateForm(model?: CategoriesPart): void {
    if (!model?.categories) {
      this.categories.reset();
      return;
    }

    // map the category IDs to the corresponding thesaurus
    // entries, if any -- else just use the IDs
    const entries: ThesaurusEntry[] = model.categories.map((id) => {
      const entry = this.entries$.value?.find((e) => e.id === id);
      return entry
        ? entry
        : {
            id,
            value: id,
          };
    });

    // sort the entries by their display value
    entries.sort((a: ThesaurusEntry, b: ThesaurusEntry) => {
      return a.value.localeCompare(b.value);
    });

    // assign them to the control
    this.categories.setValue(entries || []);
    this.form!.markAsPristine();
  }

  protected onModelSet(model?: CategoriesPart): void {
    this.updateForm(deepCopy(model));
  }

  protected getModelFromForm(): CategoriesPart {
    let part = this.model;
    if (!part) {
      part = {
        itemId: this.itemId || '',
        id: '',
        typeId: CATEGORIES_PART_TYPEID,
        roleId: this.roleId,
        timeCreated: new Date(),
        creatorId: '',
        timeModified: new Date(),
        userId: '',
        categories: [],
      };
    }
    part.categories = this.categories.value.map((entry: ThesaurusEntry) => {
      return entry.id;
    });
    return part;
  }

  protected onThesauriSet(): void {
    const key = 'categories';
    if (this.thesauri && this.thesauri[key]) {
      this.entries$.next(this.thesauri[key].entries || []);
      // update the model, as here it depends on the thesaurus
      this.onModelSet(this.model);
    }
  }

  public onEntryChange(entry: ThesaurusEntry): void {
    // add the new entry unless already present
    if (this.categories.value?.some((e: ThesaurusEntry) => e.id === entry.id)) {
      return;
    }
    const entries: ThesaurusEntry[] = Object.assign(
      [],
      this.categories.value || []
    );
    entries.push(entry);

    // sort the entries by their display value
    entries.sort((a: ThesaurusEntry, b: ThesaurusEntry) => {
      return a.value.localeCompare(b.value);
    });

    // assign to the categories control
    this.categories.setValue(entries);
    this.categories.markAsDirty();
  }

  public removeCategory(index: number): void {
    const entries = Object.assign([], this.categories.value);
    entries.splice(index, 1);
    this.categories.setValue(entries);
    this.categories.markAsDirty();
  }

  public renderLabel(label: string): string {
    return renderLabelFromLastColon(label);
  }
}
