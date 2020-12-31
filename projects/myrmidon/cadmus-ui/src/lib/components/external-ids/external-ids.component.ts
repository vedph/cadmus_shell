import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
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
import { InplaceEditorComponentBase } from '../inplace-editor-component-base';

/**
 * External IDs in-place editor.
 */
@Component({
  selector: 'cadmus-external-ids',
  templateUrl: './external-ids.component.html',
  styleUrls: ['./external-ids.component.css'],
})
export class ExternalIdsComponent
  extends InplaceEditorComponentBase<string[]>
  implements OnInit, AfterViewInit, OnDestroy {
  private _idSubscription: Subscription;

  @ViewChildren('id') idQueryList: QueryList<any>;

  public ids: FormArray; // the list of IDs

  constructor(formBuilder: FormBuilder) {
    super(formBuilder);
  }

  ngOnInit(): void {
    this.ids = this.formBuilder.array([]);
    this.initEditor('externalIds', {
      ids: this.ids,
    });
  }

  public ngAfterViewInit(): void {
    this._idSubscription = this.idQueryList.changes
      .pipe(debounceTime(300))
      .subscribe((_) => {
        if (this.idQueryList.length > 0) {
          this.idQueryList.last.nativeElement.focus();
        }
      });
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
    this._idSubscription.unsubscribe();
  }

  private getIdGroup(id?: string): FormGroup {
    return this.formBuilder.group({
      id: this.formBuilder.control(id, [
        Validators.required,
        Validators.maxLength(500),
      ]),
    });
  }

  public addId(id?: string): void {
    // do not add if already exists
    if (
      this.ids.controls.some((c: AbstractControl) => {
        return c.value === id;
      })
    ) {
      return;
    }
    this.ids.push(this.getIdGroup(id));
  }

  public addIdBelow(index: number): void {
    this.ids.insert(index + 1, this.getIdGroup());
  }

  public removeId(index: number): void {
    this.ids.removeAt(index);
  }

  public moveIdUp(index: number): void {
    if (index < 1) {
      return;
    }
    const item = this.ids.controls[index];
    this.ids.removeAt(index);
    this.ids.insert(index - 1, item);
  }

  public moveIdDown(index: number): void {
    if (index + 1 >= this.ids.length) {
      return;
    }
    const item = this.ids.controls[index];
    this.ids.removeAt(index);
    this.ids.insert(index + 1, item);
  }

  public clearIds(): void {
    this.ids.clear();
  }

  public isValidUrl(url: string): boolean {
    return new RegExp('^(?:https?://)?www.', 'gi').test(url);
    // https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
    // try {
    // } catch (_) {
    //   return false;
    // }
    // return true;
  }

  protected setModel(model: string[]): void {
    if (!this.ids) {
      return;
    }
    if (!model) {
      this.form.reset();
    } else {
      this.ids.clear();
      for (const id of model) {
        this.addId(id);
      }
      this.form.markAsPristine();
    }
  }

  public visitUrl(url: string): void {
    window.open(url, '_blank');
  }

  protected getModel(): string[] {
    const ids: string[] = [];
    for (let i = 0; i < this.ids.length; i++) {
      const g = this.ids.controls[i] as FormGroup;
      ids.push(g.controls.id.value);
    }
    return ids;
  }
}
