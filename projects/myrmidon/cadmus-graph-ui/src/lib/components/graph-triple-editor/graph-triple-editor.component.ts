import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GraphService, NodeResult, TripleResult } from '@myrmidon/cadmus-api';
import { ThesaurusNode } from '@myrmidon/cadmus-thesaurus-ui';
import { NgToolsValidators } from '@myrmidon/ng-tools';
import { take } from 'rxjs/operators';

@Component({
  selector: 'cadmus-graph-triple-editor',
  templateUrl: './graph-triple-editor.component.html',
  styleUrls: ['./graph-triple-editor.component.css'],
})
export class GraphTripleEditorComponent implements OnInit {
  private _triple: TripleResult | undefined;

  @Input()
  public get triple(): TripleResult | undefined {
    return this._triple;
  }
  public set triple(value: TripleResult | undefined) {
    this._triple = value;
    this.updateForm();
  }

  /**
   * The optional set of thesaurus entries for triple's tags.
   */
  @Input()
  public tagEntries?: ThesaurusNode[];

  /**
   * Emitted when triple has changed.
   */
  @Output()
  public tripleChange: EventEmitter<TripleResult>;

  /**
   * Emitted when the user requested to close the editor.
   */
  @Output()
  public editorClose: EventEmitter<any>;

  public isNew: boolean;

  public subjectNode: FormControl;
  public predicateNode: FormControl;
  public literal: FormControl;
  public objectNode: FormControl;
  public objectLit: FormControl;
  public tag: FormControl;
  public form: FormGroup;

  constructor(
    formBuilder: FormBuilder,
    private _snackbar: MatSnackBar,
    private _graphService: GraphService
  ) {
    this.tripleChange = new EventEmitter<TripleResult>();
    this.editorClose = new EventEmitter<any>();
    this.isNew = true;
    // form
    this.subjectNode = formBuilder.control(null, Validators.required);
    this.predicateNode = formBuilder.control(null, Validators.required);
    this.literal = formBuilder.control(false);
    this.objectNode = formBuilder.control(
      null,
      NgToolsValidators.conditionalValidator(
        // when literal is not true, object is required
        () => !this.form.get('literal')?.value,
        Validators.required
      )
    );
    this.objectLit = formBuilder.control(null, [
      Validators.maxLength(15000),
      // when literal is true, object literal is required
      NgToolsValidators.conditionalValidator(
        () => this.form.get('literal')?.value,
        Validators.required
      ),
    ]);
    this.tag = formBuilder.control(null, Validators.maxLength(50));
    this.form = formBuilder.group({
      subjectNode: this.subjectNode,
      predicateNode: this.predicateNode,
      literal: this.literal,
      objectNode: this.objectNode,
      objectLit: this.objectLit,
      tag: this.tag,
    });
  }

  ngOnInit(): void {}

  public onSubjectChange(node?: NodeResult | null): void {
    this.subjectNode.setValue(node ?? undefined);
  }

  public onPredicateChange(node?: NodeResult | null): void {
    this.predicateNode.setValue(node ?? undefined);
  }

  public onObjectChange(node?: NodeResult | null): void {
    this.objectNode.setValue(node ?? undefined);
  }

  private getNode(id: number): Promise<NodeResult | undefined> {
    return new Promise((resolve, reject) => {
      this._graphService
        .getNode(id)
        .pipe(take(1))
        .subscribe(
          (node) => {
            resolve(node);
          },
          (error) => {
            if (error) {
              console.error(JSON.stringify(error));
            }
            this._snackbar.open('Error loading node ' + id, 'OK');
            reject();
          }
        );
    });
  }

  private updateForm(triple?: TripleResult): void {
    if (!triple) {
      this.form.reset();
      this.isNew = true;
      return;
    }
    if (triple.subjectId) {
      this.getNode(triple.subjectId).then((node) => {
        this.subjectNode.setValue(node);
      });
    } else {
      this.subjectNode.reset();
    }
    if (triple.predicateId) {
      this.getNode(triple.predicateId).then((node) => {
        this.predicateNode.setValue(node);
      });
    } else {
      this.predicateNode.reset();
    }
    if (triple.objectId) {
      this.getNode(triple.objectId).then((node) => {
        this.objectNode.setValue(node);
      });
    } else {
      this.objectNode.reset();
      this.objectLit.setValue(triple.objectLiteral);
    }
    this.isNew = triple.id ? false : true;
    this.form.markAsPristine();
  }

  private getTriple(): TripleResult {
    return {
      id: this.triple?.id || 0,
      subjectId: this.subjectNode.value?.id || 0,
      predicateId: this.predicateNode.value?.id || 0,
      objectId: this.objectNode.value?.id || 0,
      objectLiteral: this.objectLit.value?.trim(),
      subjectUri: this.subjectNode.value?.uri,
      predicateUri: this.predicateNode.value?.uri,
      objectUri: this.objectNode.value?.uri,
    };
  }

  public cancel(): void {
    this.editorClose.emit();
  }

  public save(): void {
    if (this.form.invalid) {
      return;
    }
    this.tripleChange.emit(this.getTriple());
  }
}
