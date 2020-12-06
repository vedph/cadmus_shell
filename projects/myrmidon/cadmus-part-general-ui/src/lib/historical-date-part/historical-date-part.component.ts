import { Component, OnInit } from '@angular/core';
import {
  HistoricalDatePart,
  HISTORICAL_DATE_PART_TYPEID,
} from '../historical-date-part';
import { ModelEditorComponentBase } from '@myrmidon/cadmus-ui';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import {
  HistoricalDateModel,
  deepCopy,
  DocReference,
} from '@myrmidon/cadmus-core';
import { AuthService } from '@myrmidon/cadmus-api';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'cadmus-historical-date-part',
  templateUrl: './historical-date-part.component.html',
  styleUrls: ['./historical-date-part.component.css'],
})
export class HistoricalDatePartComponent
  extends ModelEditorComponentBase<HistoricalDatePart>
  implements OnInit {
  public hasDate: FormControl;

  public date: HistoricalDateModel | undefined;
  // references
  public references$: BehaviorSubject<DocReference[]>;
  public references: DocReference[];

  constructor(authService: AuthService, formBuilder: FormBuilder) {
    super(authService);
    // form
    this.references$ = new BehaviorSubject<DocReference[]>([]);
    this.hasDate = formBuilder.control(false, Validators.requiredTrue);
    this.form = formBuilder.group({
      hasDate: this.hasDate,
    });
  }

  ngOnInit(): void {
    this.initEditor();
  }

  protected onModelSet(model: HistoricalDatePart): void {
    this.references$.next(model?.references || []);
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
    part.references = this.references?.length ? this.references : undefined;
    return part;
  }

  public onDateChange(date: HistoricalDateModel): void {
    this.date = date;
    this.hasDate.setValue(date ? true : false);
    this.hasDate.markAsDirty();
  }

  public onReferencesChange(references: DocReference[]): void {
    this.references = references;
    this.form.markAsDirty();
  }
}
