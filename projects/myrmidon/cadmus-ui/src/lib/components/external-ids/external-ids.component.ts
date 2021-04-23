import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

/**
 * External IDs real-time editor.
 * Set the IDs with the ids property, and get their changes in real-time
 * via idsChange. Usually you should set the ids property once in the
 * container of this component (e.g. using an initialIds string array,
 * changed only when a new model is set), and then change the IDs as
 * emitted by this component in a FormControl with an array value.
 * So for instance you would have [ids]="initialIds" and
 * (idsChange)="onIdsChange($event)", and in this handler you would just
 * call ids.setValue(ids). This is required to avoid a recursive update
 * (setting ids would trigger idsChange, which in turn would trigger
 * setting ids again, and so on), and is due to the fact that this component
 * has no "save" action, but automatically emits changes a few milliseconds
 * after they happen.
 */
@Component({
  selector: 'cadmus-external-ids',
  templateUrl: './external-ids.component.html',
  styleUrls: ['./external-ids.component.css'],
})
export class ExternalIdsComponent implements AfterViewInit, OnDestroy {
  // https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
  // private readonly _urlRegex = new RegExp('^(?:https?://)?www.', 'gi');
  private _updatingForm: boolean;
  // private _lastFocusedElId: string | undefined;
  private _ids: string[];
  private _idSubscription: Subscription | undefined;
  private _idsSubs: Subscription[];

  @ViewChildren('id') idQueryList: QueryList<any>;

  /**
   * The external IDs.
   */
  @Input()
  public get ids(): string[] {
    return this._ids;
  }
  public set ids(value: string[]) {
    this._ids = value || [];
    this.updateForm(value);
  }

  /**
   * Emitted whenever any ID changes.
   */
  @Output()
  public idsChange: EventEmitter<string[]>;

  public idsArr: FormArray;
  public form: FormGroup;

  constructor(private _formBuilder: FormBuilder) {
    this._idsSubs = [];
    this.idsChange = new EventEmitter<string[]>();
    // form
    this.idsArr = _formBuilder.array([]);
    this.form = _formBuilder.group({
      idsArr: this.idsArr,
    });
  }

  public ngAfterViewInit(): void {
    // focus on newly added ID
    this._idSubscription = this.idQueryList.changes
      .pipe(debounceTime(300))
      .subscribe((lst: QueryList<any>) => {
        if (
          !this._updatingForm &&
          lst.length > 0
        ) {
          lst.last.nativeElement.focus();
        }
      });
  }

  private unsubscribeIds(): void {
    for (let i = 0; i < this._idsSubs.length; i++) {
      this._idsSubs[i].unsubscribe();
    }
  }

  public ngOnDestroy(): void {
    this.unsubscribeIds();
    this._idSubscription.unsubscribe();
  }

  // #region Ids
  private getIdGroup(id?: string): FormGroup {
    return this._formBuilder.group({
      id: this._formBuilder.control(id, [
        Validators.required,
        Validators.maxLength(500),
      ]),
    });
  }

  public addId(id?: string): void {
    // do not add if already exists
    if (
      this.idsArr.controls.some((c: AbstractControl) => {
        return c.value === id;
      })
    ) {
      return;
    }
    const g = this.getIdGroup(id);
    this._idsSubs.push(
      g.valueChanges.pipe(debounceTime(300)).subscribe((_) => {
        this.emitIdsChange();
      })
    );
    this.idsArr.push(g);

    if (!this._updatingForm) {
      this.emitIdsChange();
    }
  }

  public removeId(index: number): void {
    this._idsSubs[index].unsubscribe();
    this._idsSubs.splice(index, 1);
    this.idsArr.removeAt(index);
    this.emitIdsChange();
  }

  private swapArrElems(a: any[], i: number, j: number): void {
    if (i === j) {
      return;
    }
    const t = a[i];
    a[i] = a[j];
    a[j] = t;
  }

  public moveIdUp(index: number): void {
    if (index < 1) {
      return;
    }
    const ctl = this.idsArr.controls[index];
    this.idsArr.removeAt(index);
    this.idsArr.insert(index - 1, ctl);

    this.swapArrElems(this._idsSubs, index, index - 1);

    this.emitIdsChange();
  }

  public moveIdDown(index: number): void {
    if (index + 1 >= this.idsArr.length) {
      return;
    }
    const item = this.idsArr.controls[index];
    this.idsArr.removeAt(index);
    this.idsArr.insert(index + 1, item);

    this.swapArrElems(this._idsSubs, index, index + 1);

    this.emitIdsChange();
  }

  public clearIds(): void {
    this.idsArr.clear();
    this.unsubscribeIds();
    this._idsSubs = [];
    if (!this._updatingForm) {
      this.emitIdsChange();
    }
  }
  // #endregion

  // public isValidUrl(url: string): boolean {
  //   return this._urlRegex.test(url);
  // }

  private updateForm(ids: string[]): void {
    if (!this.idsArr) {
      return;
    }
    this._updatingForm = true;
    this.clearIds();

    if (!ids) {
      this.form.reset();
    } else {
      for (const id of ids) {
        this.addId(id);
      }
      this.form.markAsPristine();
    }
    this._updatingForm = false;
    this.emitIdsChange();
  }

  public visitUrl(url: string): void {
    window.open(url, '_blank');
  }

  private getIds(): string[] {
    const ids: string[] = [];
    for (let i = 0; i < this.idsArr.length; i++) {
      const g = this.idsArr.controls[i] as FormGroup;
      ids.push(g.controls.id.value);
    }
    return ids;
  }

  private emitIdsChange(): void {
    this.idsChange.emit(this.getIds());
  }
}
