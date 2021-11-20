import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

import { HistoricalDateModel, ThesaurusEntry } from '@myrmidon/cadmus-core';
import { ModelEditorComponentBase } from '@myrmidon/cadmus-ui';
import { AuthService } from '@myrmidon/cadmus-api';
import { DocReference } from '@myrmidon/cadmus-refs-doc-references';
import { deepCopy } from '@myrmidon/ng-tools';

import {
  HistoricalDatePart,
  HISTORICAL_DATE_PART_TYPEID,
} from '../historical-date-part';

@Component({
  selector: 'cadmus-historical-date-part',
  templateUrl: './historical-date-part.component.html',
  styleUrls: ['./historical-date-part.component.css'],
})
export class HistoricalDatePartComponent
  extends ModelEditorComponentBase<HistoricalDatePart>
  implements OnInit
{
  public hasDate: FormControl;
  public references: FormControl;

  public date: HistoricalDateModel | undefined;
  public initialRefs: DocReference[];

  public typeEntries: ThesaurusEntry[] | undefined;
  public tagEntries: ThesaurusEntry[] | undefined;

  constructor(authService: AuthService, formBuilder: FormBuilder) {
    super(authService);
    // form
    this.initialRefs = [];
    this.hasDate = formBuilder.control(false, Validators.requiredTrue);
    this.references = formBuilder.control([]);
    this.form = formBuilder.group({
      hasDate: this.hasDate,
      references: this.references,
    });
  }

  ngOnInit(): void {
    this.initEditor();
  }

  protected onThesauriSet(): void {
    let key = 'doc-reference-tags';
    if (this.thesauri && this.thesauri[key]) {
      this.tagEntries = this.thesauri[key].entries;
    } else {
      this.tagEntries = undefined;
    }

    key = 'doc-reference-types';
    if (this.thesauri && this.thesauri[key]) {
      this.typeEntries = this.thesauri[key].entries;
    } else {
      this.typeEntries = undefined;
    }
  }

  protected onModelSet(model: HistoricalDatePart): void {
    this.initialRefs = model?.references || [];
    this.date = model?.date ? deepCopy(model.date) : undefined;
    this.hasDate.setValue(model ? true : false);
    // TODO: remove hack
    setTimeout(() => {
      this.form.markAsPristine();
    }, 100);
  }

  protected getModelFromForm(): HistoricalDatePart {
    let part = this.model;
    if (!part) {
      part = {
        itemId: this.itemId,
        id: null,
        typeId: HISTORICAL_DATE_PART_TYPEID,
        roleId: this.roleId,
        timeCreated: new Date(),
        creatorId: null,
        timeModified: new Date(),
        userId: null,
        date: null,
      };
    }
    part.date = this.date;
    part.references = this.references.value?.length
      ? this.references.value
      : undefined;
    return part;
  }

  public onDateChange(date: HistoricalDateModel): void {
    this.date = date;
    this.hasDate.setValue(date ? true : false);
    this.hasDate.markAsDirty();
  }

  public onReferencesChange(references: DocReference[]): void {
    this.references.setValue(references);
    this.form.markAsDirty();
  }
}
