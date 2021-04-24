import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, Validators } from '@angular/forms';

import { ModelEditorComponentBase } from '@myrmidon/cadmus-ui';
import { AuthService } from '@myrmidon/cadmus-api';
import { deepCopy, DocReference, ThesaurusEntry } from '@myrmidon/cadmus-core';
import {
  DocReferencesPart,
  DOC_REFERENCES_PART_TYPEID,
} from '../doc-references-part';

/**
 * Document references part editor.
 * Thesauri: doc-reference-tags (optional).
 */
@Component({
  selector: 'cadmus-doc-references-part',
  templateUrl: './doc-references-part.component.html',
  styleUrls: ['./doc-references-part.component.css'],
})
export class DocReferencesPartComponent
  extends ModelEditorComponentBase<DocReferencesPart>
  implements OnInit {
  public references: FormControl;
  public initialRefs: DocReference[];

  public tagEntries: ThesaurusEntry[] | undefined;

  constructor(authService: AuthService, formBuilder: FormBuilder) {
    super(authService);
    this.initialRefs = [];
    // form
    this.references = formBuilder.control([], Validators.required);
    this.form = formBuilder.group({
      references: this.references,
    });
  }

  public ngOnInit(): void {
    this.initEditor();
  }

  private updateForm(model: DocReferencesPart): void {
    if (!model) {
      this.form.reset();
      return;
    }
    this.initialRefs = model.references || [];
    this.form.markAsPristine();
  }

  protected onModelSet(model: DocReferencesPart): void {
    this.updateForm(deepCopy(model));
  }

  protected onThesauriSet(): void {
    const key = 'doc-reference-tags';
    if (this.thesauri && this.thesauri[key]) {
      this.tagEntries = this.thesauri[key].entries;
    } else {
      this.tagEntries = undefined;
    }
  }

  protected getModelFromForm(): DocReferencesPart {
    let part = deepCopy(this.model);
    if (!part) {
      part = {
        itemId: this.itemId,
        id: null,
        typeId: DOC_REFERENCES_PART_TYPEID,
        roleId: this.roleId,
        timeCreated: new Date(),
        creatorId: null,
        timeModified: new Date(),
        userId: null,
        references: [],
      };
    }
    part.references = this.references.value?.length
      ? this.references.value
      : undefined;
    return part;
  }

  public onReferencesChange(references: DocReference[]): void {
    this.references.setValue(references);
    this.form.markAsDirty();
  }
}
