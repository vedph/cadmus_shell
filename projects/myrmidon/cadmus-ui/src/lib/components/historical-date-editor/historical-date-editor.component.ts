import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import {
  HistoricalDate,
  Datation,
  HistoricalDateModel,
  DatationModel,
  HistoricalDateType,
} from '@myrmidon/cadmus-core';

@Component({
  selector: 'cadmus-historical-date-editor',
  templateUrl: './historical-date-editor.component.html',
  styleUrls: ['./historical-date-editor.component.css'],
})
export class HistoricalDateEditorComponent implements OnInit {
  private _disabled?: boolean;
  private _date?: HistoricalDateModel;

  @Input()
  public get date(): HistoricalDateModel | undefined {
    return this._date;
  }
  public set date(value: HistoricalDateModel | undefined) {
    this._date = value;
    this.updateForm(value);
  }

  @Input()
  public label?: string;

  @Input()
  public get disabled(): boolean | undefined {
    return this._disabled;
  }
  public set disabled(value: boolean | undefined) {
    this._disabled = value;
    if (value) {
      this.visualExpanded = false;
      this.form.disable();
    } else {
      this.form.enable();
    }
  }

  @Output()
  public dateChange: EventEmitter<HistoricalDateModel>;

  // set by date text:
  public a$: BehaviorSubject<DatationModel | undefined>;
  public b$: BehaviorSubject<DatationModel | undefined>;
  public invalidDateText?: boolean;
  public dateValue?: number;
  public visualExpanded?: boolean;
  // set by events:
  public a?: DatationModel;
  public b?: DatationModel;

  // form
  public form: FormGroup;
  public dateText: FormControl;
  public range: FormControl;

  constructor(formBuilder: FormBuilder) {
    // events
    this.dateChange = new EventEmitter<HistoricalDateModel>();
    // data
    this.a$ = new BehaviorSubject<DatationModel | undefined>({
      value: 0,
    });
    this.b$ = new BehaviorSubject<DatationModel | undefined>({
      value: 0,
    });
    // form
    this.dateText = formBuilder.control(null, Validators.required);
    this.range = formBuilder.control(false);
    this.form = formBuilder.group({
      dateText: this.dateText,
      range: this.range,
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
          this.range.setValue(hd.getDateType() === HistoricalDateType.range);
          this.a$.next(hd.a);
          this.b$.next(hd.b);
          // this.dateChange.emit(hd);
        } else {
          this.invalidDateText = true;
          this.dateValue = 0;
        }
      });
    this.updateForm(this._date);
  }

  private updateForm(date?: HistoricalDateModel): void {
    if (!date) {
      this.form.reset();
    } else {
      const hd = new HistoricalDate(date);
      this.dateText.setValue(hd.toString());
      this.form.markAsPristine();
    }
  }

  public stopPropagation(event: KeyboardEvent): void {
    // this is to avoid space propagating to the expander,
    // which would toggle it
    // https://stackoverflow.com/questions/53543824/input-not-working-inside-angular-material-expansion-panel-cant-add-space
    event.stopPropagation();
  }

  public onDatationAChange(model: DatationModel): void {
    this.a = model;
  }

  public onDatationBChange(model: DatationModel): void {
    this.b = model;
  }

  public resetDatations(): void {
    this.range.setValue(false);
    this.a$.next({ value: 0 });
    this.b$.next({ value: 0 });
  }

  public setDatations(): void {
    const hd = new HistoricalDate();
    hd.a = new Datation(this.a);
    if (this.range.value) {
      hd.b = new Datation(this.b);
    }

    this.dateText.setValue(hd.toString());
    this.visualExpanded = false;
  }

  public save(): void {
    try {
      const hd = HistoricalDate.parse(this.dateText.value);
      if (hd) {
        this.invalidDateText = false;
        this.dateValue = hd.getSortValue();
        this.range.setValue(hd.getDateType() === HistoricalDateType.range);
        this.a$.next(hd.a);
        this.b$.next(hd.b);
        this.dateChange.emit(hd);
      } else {
        this.invalidDateText = true;
        this.dateValue = 0;
      }
    } catch (error) {
      console.log(error);
      this.invalidDateText = true;
      this.dateValue = 0;
    }
  }
}
