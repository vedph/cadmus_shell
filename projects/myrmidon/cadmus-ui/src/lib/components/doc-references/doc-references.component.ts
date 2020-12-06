import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThesaurusEntry, DocReference } from '@myrmidon/cadmus-core';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { InplaceEditorComponentBase } from '../inplace-editor-component-base';

/**
 * In-place editor for a set of DocReference's.
 */
@Component({
  selector: 'cadmus-doc-references',
  templateUrl: './doc-references.component.html',
  styleUrls: ['./doc-references.component.css'],
})
export class DocReferencesComponent
  extends InplaceEditorComponentBase<DocReference[]>
  implements OnInit, AfterViewInit, OnDestroy {
  private _authorSubscription: Subscription;
  public references: FormArray;

  @ViewChildren('author') authorQueryList: QueryList<any>;

  @Input()
  public tagEntries: ThesaurusEntry[];
  // TODO other thesauri (author/work)

  constructor(formBuilder: FormBuilder) {
    super(formBuilder);
  }

  ngOnInit(): void {
    this.references = this.formBuilder.array([]);

    this.initEditor('references', {
      references: this.references,
    });
  }

  public ngAfterViewInit(): void {
    this._authorSubscription = this.authorQueryList.changes
      .pipe(debounceTime(300))
      .subscribe((_) => {
        if (this.authorQueryList.length > 0) {
          this.authorQueryList.last.nativeElement.focus();
        }
      });
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
    this._authorSubscription.unsubscribe();
  }

  private getReferenceGroup(reference?: DocReference): FormGroup {
    return this.formBuilder.group({
      tag: this.formBuilder.control(reference?.tag, [Validators.maxLength(50)]),
      author: this.formBuilder.control(reference?.author, [
        Validators.required,
        Validators.maxLength(50),
      ]),
      work: this.formBuilder.control(reference?.work, [
        Validators.required,
        Validators.maxLength(100),
      ]),
      location: this.formBuilder.control(reference?.location, [
        Validators.maxLength(20),
      ]),
      note: this.formBuilder.control(reference?.note, [
        Validators.maxLength(300),
      ]),
    });
  }

  public addReference(reference?: DocReference): void {
    this.references.push(this.getReferenceGroup(reference));
  }

  public addReferenceBelow(index: number): void {
    this.references.insert(index + 1, this.getReferenceGroup());
  }

  public removeReference(index: number): void {
    this.references.removeAt(index);
  }

  public moveReferenceUp(index: number): void {
    if (index < 1) {
      return;
    }
    const item = this.references.controls[index];
    this.references.removeAt(index);
    this.references.insert(index - 1, item);
  }

  public moveReferenceDown(index: number): void {
    if (index + 1 >= this.references.length) {
      return;
    }
    const item = this.references.controls[index];
    this.references.removeAt(index);
    this.references.insert(index + 1, item);
  }

  protected setModel(value: DocReference[]): void {
    if (!this.references) {
      return;
    }
    if (!value) {
      this.form.reset();
    } else {
      this.references.clear();
      for (const r of value) {
        this.addReference(r);
      }
      this.form.markAsPristine();
    }
  }

  protected getModel(): DocReference[] {
    const references: DocReference[] = [];

    for (let i = 0; i < this.references.length; i++) {
      const g = this.references.controls[i] as FormGroup;
      references.push({
        tag: g.controls.tag.value?.trim(),
        author: g.controls.author.value?.trim(),
        work: g.controls.work.value?.trim(),
        location: g.controls.location.value?.trim(),
        note: g.controls.note.value?.trim(),
      });
    }

    return references;
  }
}
