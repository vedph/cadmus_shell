import { Component, OnInit } from '@angular/core';
import {
  HistoricalDatePart,
  HISTORICAL_DATE_PART_TYPEID,
} from '../historical-date-part';
import { ModelEditorComponentBase } from '@myrmidon/cadmus-ui';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { HistoricalDateModel, deepCopy } from '@myrmidon/cadmus-core';
import { AuthService } from '@myrmidon/cadmus-api';

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

  constructor(authService: AuthService, formBuilder: FormBuilder) {
    super(authService);
    this.hasDate = formBuilder.control(false, Validators.requiredTrue);
    this.form = formBuilder.group({
      hasDate: this.hasDate,
    });
  }

  ngOnInit(): void {
    this.initEditor();
  }

  protected onModelSet(model: HistoricalDatePart): void {
    this.date = model?.date ? deepCopy(model.date) : undefined;
    this.form.markAsPristine();
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
    return part;
  }

  public onDateChange(date: HistoricalDateModel): void {
    this.date = date;
    this.hasDate.setValue(date ? true : false);
  }
}
