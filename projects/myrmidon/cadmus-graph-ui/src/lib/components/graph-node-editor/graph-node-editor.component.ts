import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NodeResult, NodeSourceType } from '@myrmidon/cadmus-api';
import { ThesaurusEntry } from '@myrmidon/cadmus-core';

/**
 * Graph node editor.
 */
@Component({
  selector: 'cadmus-graph-node-editor',
  templateUrl: './graph-node-editor.component.html',
  styleUrls: ['./graph-node-editor.component.css'],
})
export class GraphNodeEditorComponent implements OnInit {
  private _node?: NodeResult;

  /**
   * The node being edited. A new node has ID=0 and no uri.
   */
  @Input()
  public get node(): NodeResult | undefined {
    return this._node;
  }
  public set node(value: NodeResult | undefined) {
    this._node = value;
    this.updateForm(value);
  }

  /**
   * The optional set of thesaurus entries for node's tags.
   */
  @Input()
  public tagEntries?: ThesaurusEntry[];

  /**
   * Emitted when the node has changed.
   */
  @Output()
  public nodeChange: EventEmitter<NodeResult>;

  /**
   * Emitted when the user requested to close the editor.
   */
  @Output()
  public editorClose: EventEmitter<any>;

  public isNew: boolean;

  public uri: FormControl;
  public label: FormControl;
  public isClass: FormControl;
  public tag: FormControl;
  public form: FormGroup;

  constructor(formBuilder: FormBuilder) {
    this.nodeChange = new EventEmitter<NodeResult>();
    this.editorClose = new EventEmitter<any>();
    this.isNew = true;
    // form
    this.uri = formBuilder.control(null, [
      Validators.required,
      Validators.maxLength(500),
    ]);
    this.label = formBuilder.control(null, [
      Validators.required,
      Validators.maxLength(500),
    ]);
    this.isClass = formBuilder.control(false);
    this.tag = formBuilder.control(null, Validators.maxLength(50));
    this.form = formBuilder.group({
      uri: this.uri,
      label: this.label,
      isClass: this.isClass,
      tag: this.tag,
    });
  }

  ngOnInit(): void {}

  private updateForm(node?: NodeResult): void {
    if (!node) {
      this.form.reset();
      this.isNew = true;
      return;
    }
    this.uri.setValue(node.uri);
    this.label.setValue(node.label);
    this.isClass.setValue(node.isClass ? true : false);
    this.tag.setValue(node.tag);
    this.isNew = node.id ? false : true;
    this.form.markAsPristine();
  }

  private getNode(): NodeResult {
    return {
      id: this._node?.id || 0,
      sourceType: this._node?.sourceType || NodeSourceType.User,
      uri: this.uri.value?.trim(),
      label: this.label.value?.trim(),
      isClass: this.isClass.value,
      tag: this.tag.value?.trim(),
    };
  }

  public cancel(): void {
    this.editorClose.emit();
  }

  public save(): void {
    if (this.form.invalid) {
      return;
    }
    this.nodeChange.emit(this.getNode());
  }
}
