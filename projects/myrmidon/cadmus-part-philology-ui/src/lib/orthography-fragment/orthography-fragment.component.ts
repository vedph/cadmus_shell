import { Component, OnInit } from '@angular/core';
import { OrthographyFragment } from '../orthography-fragment';
import {
  FormControl,
  FormGroup,
  FormArray,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { MspValidators } from '../msp-validators';
import { DialogService, ModelEditorComponentBase } from '@myrmidon/cadmus-ui';
import { take } from 'rxjs/operators';
import { diff_match_patch } from 'diff-match-patch';
import {
  trigger,
  transition,
  style,
  animate,
  state,
} from '@angular/animations';
import { MspOperation } from '../msp-operation';
import { DifferResultToMspAdapter } from '../differ-result-to-msp-adapter';
import { AuthService } from '@myrmidon/cadmus-api';
import { deepCopy } from '@myrmidon/cadmus-core';

@Component({
  selector: 'cadmus-orthography-fragment',
  templateUrl: './orthography-fragment.component.html',
  styleUrls: ['./orthography-fragment.component.css'],
  animations: [
    trigger('slideInOut', [
      state(
        'open',
        style({
          height: '100%',
        })
      ),
      state(
        'close',
        style({
          height: 0,
        })
      ),
      transition('open <=> closed', [animate('300ms ease-in')]),
    ]),
  ],
})
export class OrthographyFragmentComponent
  extends ModelEditorComponentBase<OrthographyFragment>
  implements OnInit {
  private _currentOperationIndex: number;
  private _differ: diff_match_patch;
  private _adapter: DifferResultToMspAdapter;

  public standard: FormControl;
  public operations: FormArray;
  public currentOperation: MspOperation;

  constructor(
    authService: AuthService,
    private _formBuilder: FormBuilder,
    private _dialogService: DialogService
  ) {
    super(authService);

    // form
    this.standard = _formBuilder.control(null, [
      Validators.required,
      Validators.maxLength(100),
    ]);
    this.operations = _formBuilder.array([]);
    this.form = _formBuilder.group({
      standard: this.standard,
      operations: this.operations,
    });
  }

  ngOnInit(): void {
    this.initEditor();
  }

  private updateForm(model: OrthographyFragment): void {
    if (!model) {
      this.form.reset();
    } else {
      this.standard.setValue(model.standard);
      if (model.operations) {
        for (const op of model.operations) {
          this.addOperation(op);
        }
      }
      this.form.markAsPristine();
    }
  }

  protected onModelSet(model: OrthographyFragment): void {
    this.updateForm(deepCopy(model));
  }

  public addOperation(operation: string = null): void {
    this.operations.markAsDirty();
    this.operations.push(
      this._formBuilder.group({
        text: this._formBuilder.control(operation, [
          Validators.required,
          MspValidators.msp,
        ]),
      })
    );
  }

  public deleteOperation(index: number): void {
    this._dialogService
      .confirm('Warning', `Delete operation #${index + 1}?`)
      .pipe(take(1))
      .subscribe((ok: boolean) => {
        if (ok) {
          this.operations.markAsDirty();
          this.operations.removeAt(index);
        }
      });
  }

  public clearOperations(): void {
    this._dialogService
      .confirm('Warning', 'Delete all the operations?')
      .pipe(take(1))
      .subscribe((ok: boolean) => {
        if (ok) {
          this.operations.markAsDirty();
          this.operations.clear();
          this.currentOperationClosed();
        }
      });
  }

  public moveOperationUp(index: number): void {
    if (index < 1) {
      return;
    }
    const item = this.operations.controls[index];
    this.operations.markAsDirty();
    this.operations.removeAt(index);
    this.operations.insert(index - 1, item);
  }

  public moveOperationDown(index: number): void {
    if (index + 1 >= this.operations.length) {
      return;
    }
    const item = this.operations.controls[index];
    this.operations.markAsDirty();
    this.operations.removeAt(index);
    this.operations.insert(index + 1, item);
  }

  public editOperation(index: number): void {
    const form = this.operations.at(index) as FormGroup;
    this._currentOperationIndex = index;
    this.currentOperation = MspOperation.parse(form.controls.text.value);
  }

  public currentOperationSaved(operation: MspOperation): void {
    const form = this.operations.at(this._currentOperationIndex) as FormGroup;
    form.controls.text.setValue(operation.toString());
    this._currentOperationIndex = null;
    this.currentOperation = null;
  }

  public currentOperationClosed(): void {
    this._currentOperationIndex = null;
    this.currentOperation = null;
  }

  private getOperations(): string[] {
    const ops: string[] = [];

    for (let i = 0; i < this.operations.controls.length; i++) {
      const form = this.operations.at(i) as FormGroup;
      const op = MspOperation.parse(form.controls.text.value);
      if (op) {
        ops.push(op.toString());
      }
    }

    return ops;
  }

  protected getModelFromForm(): OrthographyFragment {
    return {
      location: this.model?.location ?? '',
      standard: this.standard.value?.trim(),
      operations: this.getOperations(),
    };
  }

  public autoAddOperations(): void {
    // we must have both A and B text
    if (!this.model.baseText || !this.standard.value) {
      return;
    }

    // instantiate the diffing engine if required
    if (!this._differ) {
      this._differ = new diff_match_patch();
      this._adapter = new DifferResultToMspAdapter();
    }

    // set operations
    const result = this._differ.diff_main(
      this.model.baseText,
      this.standard.value
    );
    const ops = this._adapter.adapt(result);

    this.operations.markAsDirty();
    this.operations.clear();
    for (const op of ops) {
      this.addOperation(op.toString());
    }
  }
}
