import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

import {
  ThesaurusEntry,
  PhysicalDimension,
  PhysicalSize,
} from '@myrmidon/cadmus-core';

@Component({
  selector: 'cadmus-physical-size',
  templateUrl: './physical-size.component.html',
  styleUrls: ['./physical-size.component.css'],
})
export class PhysicalSizeComponent implements OnInit {
  private _size: PhysicalSize | undefined;

  @Input()
  public parentForm?: FormGroup;

  @Input()
  public get size(): PhysicalSize | undefined {
    return this._size;
  }
  public set size(value: PhysicalSize | undefined) {
    this._size = value;
    this.updateForm(value);
  }

  @Input()
  public unitEntries?: ThesaurusEntry[];
  @Input()
  public tagEntries?: ThesaurusEntry[];
  @Input()
  public dimTagEntries?: ThesaurusEntry[];

  @Output()
  public sizeChange: EventEmitter<PhysicalSize>;

  public form: FormGroup;
  public tag: FormControl;
  public wValue: FormControl;
  public wUnit: FormControl;
  public wTag: FormControl;
  public hValue: FormControl;
  public hUnit: FormControl;
  public hTag: FormControl;
  public dValue: FormControl;
  public dUnit: FormControl;
  public dTag: FormControl;
  public note: FormControl;

  public label?: string;

  constructor(formBuilder: FormBuilder) {
    // events
    this.sizeChange = new EventEmitter<PhysicalSize>();
    // form
    this.tag = formBuilder.control(null, Validators.maxLength(50));

    this.wValue = formBuilder.control(0);
    this.wUnit = formBuilder.control('cm');
    this.wTag = formBuilder.control(null, Validators.maxLength(50));

    this.hValue = formBuilder.control(0);
    this.hUnit = formBuilder.control('cm');
    this.hTag = formBuilder.control(null, Validators.maxLength(50));

    this.dValue = formBuilder.control(0);
    this.dUnit = formBuilder.control('cm');
    this.dTag = formBuilder.control(null, Validators.maxLength(50));

    this.note = formBuilder.control(null, Validators.maxLength(100));

    this.form = formBuilder.group(
      {
        tag: this.tag,
        wValue: this.wValue,
        wUnit: this.wUnit,
        wTag: this.wTag,
        hValue: this.hValue,
        hUnit: this.hUnit,
        hTag: this.hTag,
        dValue: this.dValue,
        dUnit: this.dUnit,
        dTag: this.dTag,
        note: this.note,
      },
      {
        validators: this.validateUnit,
      }
    );
  }

  ngOnInit(): void {
    if (this.parentForm) {
      this.parentForm.addControl('size', this.form);
    }

    this.form.valueChanges.pipe(debounceTime(400)).subscribe((_) => {
      const model = this.getModel();

      if (this.isModelValid(model) && this.tag.valid && this.note.valid) {
        this.updateLabel();
        this.sizeChange.emit(model);
      }
    });

    this.updateForm(this.size);
  }

  private validateUnit(form: FormGroup): { [key: string]: any } | null {
    const w = form.get('wValue')?.value || 0;
    const h = form.get('hValue')?.value || 0;
    const d = form.get('dValue')?.value || 0;

    if (w && !form.get('wUnit')?.value) {
      return {
        unit: true,
      };
    }
    if (h && !form.get('hUnit')?.value) {
      return {
        unit: true,
      };
    }
    if (d && !form.get('dUnit')?.value) {
      return {
        unit: true,
      };
    }

    return null;
  }

  private getDimensionLabel(value: number, unit: string): string {
    if (!value) {
      return '';
    }
    let s = value.toFixed(2);
    if (unit) {
      s += ' ' + unit;
    }
    return s;
  }

  private isModelValid(model: PhysicalSize): boolean {
    if (!model) {
      return false;
    }
    return (
      // at least 1 dim with unit
      ((model.w?.value && !!model.w.unit) ||
        (model.h?.value && !!model.h.unit) ||
        (model.d?.value && !!model.d.unit)) &&
        // no dim without unit
        !(model.w?.value && !model.w.unit) &&
        !(model.h?.value && !model.h.unit) &&
        !(model.d?.value && !model.d.unit)
        ? true
        : false
    );
  }

  private updateLabel(): void {
    const sb: string[] = [];

    // determine the unique unit if any
    let uniqueUnit: string | undefined = undefined;
    if (this.wValue.value) {
      uniqueUnit = this.wUnit.value;
    }

    if (this.hValue.value) {
      if (!uniqueUnit) {
        uniqueUnit = this.hUnit.value;
      } else if (uniqueUnit !== this.hUnit.value) {
        uniqueUnit = undefined;
      }
    }

    if (this.dValue.value) {
      if (!uniqueUnit) {
        uniqueUnit = this.dUnit.value;
      } else if (uniqueUnit !== this.dUnit.value) {
        uniqueUnit = undefined;
      }
    }

    if (this.wValue.value) {
      sb.push(
        this.getDimensionLabel(
          this.wValue.value,
          uniqueUnit ? null : this.wUnit.value
        )
      );
    }
    if (this.hValue.value) {
      sb.push(
        this.getDimensionLabel(
          this.hValue.value,
          uniqueUnit ? null : this.hUnit.value
        )
      );
    }
    if (this.dValue.value) {
      sb.push(
        this.getDimensionLabel(
          this.dValue.value,
          uniqueUnit ? null : this.dUnit.value
        )
      );
    }

    this.label = sb.join(' × ') + (uniqueUnit ? ' ' + uniqueUnit : '');
  }

  private updateForm(model?: PhysicalSize): void {
    if (!model) {
      this.form.reset();
      this.label = undefined;
    } else {
      this.tag.setValue(model.tag);
      this.note.setValue(model.note);

      if (model.w?.value) {
        this.wValue.setValue(model.w.value);
        this.wUnit.setValue(model.w.unit);
        this.wTag.setValue(model.w.tag);
      } else {
        this.wValue.reset();
        this.wUnit.reset();
        this.wTag.reset();
      }

      if (model.h?.value) {
        this.hValue.setValue(model.h.value);
        this.hUnit.setValue(model.h.unit);
        this.hTag.setValue(model.h.tag);
      } else {
        this.hValue.reset();
        this.hUnit.reset();
        this.hTag.reset();
      }

      if (model.d?.value) {
        this.dValue.setValue(model.d.value);
        this.dUnit.setValue(model.d.unit);
        this.dTag.setValue(model.d.tag);
      } else {
        this.dValue.reset();
        this.dUnit.reset();
        this.dTag.reset();
      }

      this.form.markAsPristine();
      this.updateLabel();
    }
  }

  private getDimension(
    v: FormControl,
    u: FormControl,
    t: FormControl
  ): PhysicalDimension {
    return {
      value: v.value || 0,
      unit: u.value,
      tag: t.value?.trim(),
    };
  }

  private getModel(): PhysicalSize {
    return {
      tag: this.tag.value?.trim(),
      note: this.note.value?.trim(),
      w: this.wValue.value
        ? this.getDimension(this.wValue, this.wUnit, this.wTag)
        : undefined,
      h: this.hValue.value
        ? this.getDimension(this.hValue, this.hUnit, this.hTag)
        : undefined,
      d: this.dValue.value
        ? this.getDimension(this.dValue, this.dUnit, this.dTag)
        : undefined,
    };
  }
}
