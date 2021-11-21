import { Input, Output, EventEmitter, Component } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { AuthService } from '@myrmidon/cadmus-api';
import { ThesauriSet, User } from '@myrmidon/cadmus-core';

import { extractPristineChanges } from '../utils';

/**
 * Base class for part/fragment editors dumb components.
 * The model type is the templated argument T.
 * A dumb component gets as input the part/fragment model,
 * and optionally a set of thesauri.
 * It outputs the model (when saved), a request to close the
 * editor, and a notification about the dirty state of the editor
 * itself.
 * When implementing your model editor extending this class:
 * - set the form property to your "root" form;
 * - call initEditor in your OnInit;
 * - override onModelSet, and eventually OnThesauriSet;
 * - override getModelFromForm.
 */
@Component({
  template: '',
})
export abstract class ModelEditorComponentBase<T> {
  private _thesauri?: ThesauriSet;
  private _model?: T;

  /**
   * The part's item ID.
   */
  @Input()
  public itemId?: string;

  /**
   * The part's role ID.
   */
  @Input()
  public roleId?: string;

  /**
   * The model being edited.
   */
  @Input()
  public get model(): T | undefined {
    return this._model;
  }
  public set model(value: T | undefined) {
    this._model = value;
    this.onModelSet(value);
  }

  /**
   * Event emitted when the edited model is saved.
   */
  @Output()
  public modelChange: EventEmitter<T>;

  /**
   * The optional thesauri to be used within this editor.
   */
  @Input()
  public get thesauri(): ThesauriSet | undefined {
    return this._thesauri;
  }
  public set thesauri(value: ThesauriSet | undefined) {
    this._thesauri = value;
    this.onThesauriSet();
  }

  /**
   * True to disable the editor.
   */
  @Input()
  set disabled(value: boolean) {
    if (!this.form) {
      return;
    }
    if (value) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }

  /**
   * Emitted when the user requests to close the editor.
   */
  @Output()
  public editorClose: EventEmitter<any>;

  /**
   * Emitted when the dirty state of the edited data changes.
   */
  @Output()
  public dirtyChange: EventEmitter<boolean>;

  /**
   * The root form of the editor.
   * You MUST instantiate this form in the ctor.
   */
  public form?: FormGroup;

  /**
   * The current user.
   */
  public user?: User;

  /**
   * The user authorization level (0-4).
   */
  public userLevel: number;

  constructor(private _authService: AuthService) {
    this.modelChange = new EventEmitter<T>();
    this.editorClose = new EventEmitter<any>();
    this.dirtyChange = new EventEmitter<boolean>();
    this.userLevel = 0;

    _authService.currentUser$.subscribe((user: User | null) => {
      this.updateUserProperties(user);
    });
  }

  private updateUserProperties(user: User | null): void {
    if (!user) {
      this.user = undefined;
      this.userLevel = 0;
    } else {
      this.user = user;
      this.userLevel = this._authService.getCurrentUserLevel();
    }
  }

  /**
   * Initialize the editor. You MUST call this in your OnInit.
   * This initializes the thesauri and sets the data model.
   */
  protected initEditor(): void {
    this.onThesauriSet();
    this.onModelSet(this.model);

    if (this.form) {
      extractPristineChanges(this.form).subscribe((p) => {
        this.dirtyChange.emit(!p);
      });
    }
  }

  /**
   * Update the model property and emit the corresponding
   * modelChange event.
   *
   * @param model The model.
   */
  protected updateModel(model: T): void {
    this.model = model;
    this.modelChange.emit(model);
  }

  /**
   * Invoked whenever the model property is set (=data comes from input model
   * property), unless setting it via updateModel. Implement to update the form
   * controls to reflect the new model data.
   *
   * @param model The model set, or undefined.
   */
  protected abstract onModelSet(model?: T): void;

  /**
   * Invoked whenever the thesauri property is set. Override to take
   * custom actions, typically to set some bound properties.
   */
  protected onThesauriSet(): void {}

  /**
   * Implement in derived classes to get the model from form's controls.
   * This is used when saving (=data goes to the output modelChange event).
   */
  protected abstract getModelFromForm(): T;

  /**
   * Trim the specified text, if not falsy, eventually flattening and normalizing
   * its whitespaces.
   *
   * @param text The text to trim.
   * @param flattenWs True to flatten and normalize whitespaces. When this is
   * true, all the whitespaces are converted into a single space.
   * @returns The processed text.
   */
  protected trimIfAny(text: string, flattenWs = false): string {
    if (!text) {
      return text;
    }
    if (flattenWs) {
      text = text.replace(/\s+/g, ' ');
    }
    text = text.trim();
    return text;
  }

  /**
   * Emit a request to close the editor.
   */
  public close(): void {
    this.editorClose.emit();
  }

  /**
   * Save the edited data if valid. This invokes getModelFromForm to get
   * the model from the form's controls, serializes it into JSON,
   * updates the json property, and marks the root form as pristine.
   */
  public save(): void {
    if (this.form?.invalid) {
      return;
    }
    const part = this.getModelFromForm();
    this.updateModel(part);
    // the form is no more dirty
    this.form?.markAsPristine();
    this.dirtyChange.emit(false);
  }
}
