import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {
  HistoricalDate,
  Datation,
  HistoricalDateModel,
  DatationModel,
} from '@myrmidon/cadmus-core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'cadmus-historical-date-editor',
  templateUrl: './historical-date-editor.component.html',
  styleUrls: ['./historical-date-editor.component.css'],
})
export class HistoricalDateEditorComponent implements OnInit {
  private _date: HistoricalDateModel;

  @Input()
  public get date(): HistoricalDateModel {
    return this._date;
  }
  public set date(value: HistoricalDateModel) {
    this._date = value;
    if (!value) {
      this.form.reset();
    } else {
      this.dateText.setValue(value.toString());
      this.form.markAsPristine();
    }
  }

  @Output()
  public dateChange: EventEmitter<HistoricalDateModel>;

  // set by date text:
  public a$: BehaviorSubject<DatationModel>;
  public b$: BehaviorSubject<DatationModel>;
  public invalidDateText: boolean;
  public dateValue: number;
  // set by events:
  public a: DatationModel;
  public b: DatationModel;

  // form
  public form: FormGroup;
  public dateText: FormControl;

  constructor(formBuilder: FormBuilder) {
    // events
    this.dateChange = new EventEmitter<HistoricalDateModel>();
    // form
    this.dateText = formBuilder.control(null, Validators.required);
    this.form = formBuilder.group({
      dateText: this.dateText,
    });
  }

  public ngOnInit(): void {
    // whenever the date text changes, update datations and fire date change
    this.dateText.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((text) => {
        const hd = HistoricalDate.parse(text);
        if (hd) {
          this.invalidDateText = false;
          this.dateValue = hd.getSortValue();
          this.a$.next(hd.a);
          this.b$.next(hd.b);
          this.dateChange.emit(hd);
        } else {
          this.invalidDateText = true;
          this.dateValue = 0;
        }
      });
  }

  public onDatationAChange(model: DatationModel): void {
    this.a = model;
  }

  public onDatationBChange(model: DatationModel): void {
    this.b = model;
  }

  public setDatations(): void {
    if (!this.a?.value) {
      return;
    }
    const hd = new HistoricalDate();
    hd.a = new Datation(this.a);
    hd.b = new Datation(this.b);

    this.dateText.setValue(hd.toString());
  }
}
