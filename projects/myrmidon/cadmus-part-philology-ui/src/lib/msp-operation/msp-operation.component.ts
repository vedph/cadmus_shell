import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';

import { TextRange } from '@myrmidon/cadmus-core';

import { MspValidators } from '../msp-validators';
import { MspOperation, MspOperator } from '../msp-operation';

/**
 * Single misspelling operation editor.
 */
@Component({
  selector: 'cadmus-msp-operation',
  templateUrl: './msp-operation.component.html',
  styleUrls: ['./msp-operation.component.css'],
})
export class MspOperationComponent implements OnInit {
  private _operation: MspOperation;
  private _ignoreTextUpdate: boolean;
  private _ignoreVisualUpdate: boolean;

  /**
   * The operation being edited.
   */
  @Input()
  public get operation(): MspOperation {
    return this._operation;
  }
  public set operation(value: MspOperation) {
    this._operation = value;
    this.updateFormControls(value, true);
    this.form.markAsPristine();
  }

  /**
   * Fired when the operation being edited has changed.
   */
  @Output()
  public operationChange: EventEmitter<MspOperation>;
  @Output()
  public operationClose: EventEmitter<any>;

  public visualExpanded: boolean;

  // form
  public form: FormGroup;
  public visual: FormGroup;
  public text: FormControl;
  public operator: FormControl;
  public rangeA: FormControl;
  public valueA: FormControl;
  public rangeB: FormControl;
  public valueB: FormControl;
  public tag: FormControl;
  public note: FormControl;

  constructor(formBuilder: FormBuilder) {
    // events
    this.operationChange = new EventEmitter<MspOperation>();
    this.operationClose = new EventEmitter<any>();

    // form
    const rangeRegExp = /^\@?\d+(?:[x×]\d+)?$/;
    this.text = formBuilder.control(null, [
      Validators.required,
      MspValidators.msp,
    ]);

    this.operator = formBuilder.control(
      MspOperator.delete,
      Validators.required
    );

    this.rangeA = formBuilder.control(null, [
      Validators.required,
      Validators.pattern(rangeRegExp),
    ]);
    this.valueA = formBuilder.control(null, Validators.maxLength(100));

    this.rangeB = formBuilder.control(null, [Validators.pattern(rangeRegExp)]);
    this.valueB = formBuilder.control(null, Validators.maxLength(100));

    this.tag = formBuilder.control(null, [
      Validators.maxLength(50),
      Validators.pattern(/^[0-9a-zA-Z_\.\-]+$/),
    ]);

    this.note = formBuilder.control(null, [
      Validators.maxLength(100),
      Validators.pattern(/^[^{}]+$/),
    ]);

    this.visual = formBuilder.group({
      operator: this.operator,
      rangeA: this.rangeA,
      valueA: this.valueA,
      rangeB: this.rangeB,
      valueB: this.valueB,
      tag: this.tag,
      note: this.note,
    });

    this.form = formBuilder.group({
      text: this.text,
      visual: this.visual,
    });
  }

  ngOnInit(): void {
    // whenever text changes, parse the operation
    // (unless instructed to ignore the change)
    this.text.valueChanges
      .pipe(
        filter((_) => !this._ignoreTextUpdate),
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe((_) => {
        try {
          this._ignoreTextUpdate = true;
          this.updateVisual();
        } finally {
          this._ignoreTextUpdate = false;
        }
      });

    // whenever visual editor changes, update the text
    // (unless instructed to ignore the change)
    this.visual.valueChanges
      .pipe(
        filter((_) => !this._ignoreVisualUpdate),
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe((_) => {
        try {
          this._ignoreVisualUpdate = true;
          this.updateText();
        } finally {
          this._ignoreVisualUpdate = false;
        }
      });

    // adjust visual UI for current operator
    this.operator.valueChanges
      .pipe(
        filter((_) => !this._ignoreVisualUpdate),
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe((_) => {
        this.adjustVisualForOperator();
      });

    this.adjustVisualForOperator();
  }

  private updateFormControls(
    operation: MspOperation,
    updateText: boolean
  ): void {
    if (!operation) {
      this.form.reset();
      return;
    }

    const noEvent = { emitEvent: false };

    this.visual.patchValue(
      {
        operator: operation.operator,
        rangeA: operation.rangeA ? operation.rangeA.toString() : null,
        valueA: operation.valueA,
        rangeB: operation.rangeB ? operation.rangeB.toString() : null,
        valueB: operation.valueB,
        tag: operation.tag,
        note: operation.note,
      },
      noEvent
    );

    if (updateText) {
      this.text.setValue(operation.toString(), noEvent);
    }
  }

  /**
   * Update the visual editor from the text editor, if valid.
   */
  private updateVisual(): void {
    if (this._ignoreVisualUpdate) {
      return;
    }
    const operation = MspOperation.parse(this.text.value);
    if (!operation) {
      return;
    }
    this.updateFormControls(operation, false);
  }

  /**
   * Update the text editor from the visual editor, if valid.
   */
  private updateText(): void {
    if (this._ignoreTextUpdate || this.visual.invalid) {
      return;
    }
    this.text.setValue(this.getOperation().toString(), { emitEvent: false });
  }

  private adjustVisualForOperator(): void {
    const noEvent = { emitEvent: false };

    switch (this.operator.value) {
      case MspOperator.delete:
        this.rangeA.enable(noEvent);
        this.valueA.enable(noEvent);
        this.rangeB.disable(noEvent);
        this.valueB.disable(noEvent);
        this.tag.enable(noEvent);
        this.note.enable(noEvent);
        break;
      case MspOperator.replace:
      case MspOperator.insert:
        this.rangeA.enable(noEvent);
        this.valueA.enable(noEvent);
        this.rangeB.disable(noEvent);
        this.valueB.enable(noEvent);
        this.tag.enable(noEvent);
        this.note.enable(noEvent);
        break;
      case MspOperator.move:
        this.rangeA.enable(noEvent);
        this.valueA.enable(noEvent);
        this.rangeB.enable(noEvent);
        this.valueB.disable(noEvent);
        this.tag.enable(noEvent);
        this.note.enable(noEvent);
        break;
      case MspOperator.swap:
        this.rangeA.enable(noEvent);
        this.valueA.enable(noEvent);
        this.rangeB.enable(noEvent);
        this.valueB.enable(noEvent);
        this.tag.enable(noEvent);
        this.note.enable(noEvent);
        break;
      default:
        this.rangeA.disable(noEvent);
        this.valueA.disable(noEvent);
        this.rangeB.disable(noEvent);
        this.valueB.disable(noEvent);
        this.tag.disable(noEvent);
        this.note.disable(noEvent);
        break;
    }
  }

  /**
   * Get a new MspOperation object from the visual editor.
   */
  private getOperation(): MspOperation {
    const op = new MspOperation();
    op.operator = this.operator.value;
    op.rangeA = TextRange.parse(this.rangeA.value);
    op.valueA = this.valueA.value;
    op.rangeB = TextRange.parse(this.rangeB.value);
    op.valueB = this.valueB.value;
    op.tag = this.tag.value;
    op.note = this.note.value;

    return op;
  }

  public resetText(): void {
    this.form.reset();
  }

  /**
   * Close the editor.
   */
  public cancel(): void {
    this.operationClose.emit();
  }

  /**
   * Save the current operation.
   */
  public save(): void {
    if (this.form.invalid) {
      return;
    }
    this.operation = this.getOperation();
    this.operationChange.emit({ ...this._operation } as MspOperation);
  }
}
