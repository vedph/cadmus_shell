import { Component, OnInit } from '@angular/core';
import { ModelEditorComponentBase } from '@myrmidon/cadmus-ui';
import { FormControl, FormBuilder, Validators } from '@angular/forms';

import {
  HistoricalDate,
  HistoricalDateModel,
  ThesaurusEntry,
} from '@myrmidon/cadmus-core';
import { AuthService } from '@myrmidon/cadmus-api';
import { deepCopy } from '@myrmidon/ng-tools';

import { ChronologyFragment } from '../chronology-fragment';

/**
 * Chronology fragment editor component.
 * Thesauri: "chronology-tags" when you want to use a closed set of tags.
 */
@Component({
  selector: 'cadmus-chronology-fragment',
  templateUrl: './chronology-fragment.component.html',
  styleUrls: ['./chronology-fragment.component.css'],
})
export class ChronologyFragmentComponent
  extends ModelEditorComponentBase<ChronologyFragment>
  implements OnInit
{
  public tagEntries?: ThesaurusEntry[];

  // the date being edited in its text form
  public initialDate: HistoricalDateModel | undefined;

  public date: FormControl;
  public tag: FormControl;
  public tags: FormControl;
  public label: FormControl;
  public eventId: FormControl;

  constructor(authService: AuthService, formBuilder: FormBuilder) {
    super(authService);
    // form
    this.date = formBuilder.control(null, Validators.required);
    this.tag = formBuilder.control(null, Validators.maxLength(100));
    this.tags = formBuilder.control([]);
    this.label = formBuilder.control(null, Validators.maxLength(150));
    this.eventId = formBuilder.control(null, Validators.maxLength(300));
    this.form = formBuilder.group({
      date: this.date,
      tag: this.tag,
      tags: this.tags,
      label: this.label,
      eventId: this.eventId,
    });
  }

  ngOnInit(): void {
    this.initEditor();
  }

  protected onThesauriSet(): void {
    const key = 'chronology-tags';
    if (this.thesauri && this.thesauri[key]) {
      this.tagEntries = this.thesauri[key].entries;
    } else {
      this.tagEntries = undefined;
    }
  }

  private updateForm(model: ChronologyFragment): void {
    if (!model || !model.date) {
      this.form!.reset();
    } else {
      // date
      this.initialDate = model.date;
      this.date.setValue(model.date);
      // label and tag
      this.label.setValue(model.label);
      this.tag.setValue(model.tag);
      this.eventId.setValue(model.eventId);
      this.tags.setValue(model.tag);
      this.form!.markAsPristine();
    }
  }

  public onDateChange(date: HistoricalDateModel): void {
    this.date.setValue(date);
  }

  protected onModelSet(model: ChronologyFragment): void {
    this.updateForm(deepCopy(model));
  }

  protected getModelFromForm(): ChronologyFragment {
    let fr = this.model;
    if (!fr) {
      fr = {
        location: this.model?.location ?? '',
        date: new HistoricalDate(),
      };
    }
    fr.date = this.date.value;
    // label and tag
    fr.label = this.label.value?.trim();
    fr.eventId = this.eventId.value?.trim();
    fr.tag = this.tagEntries ? this.tags.value : this.tag.value;
    return fr;
  }
}
