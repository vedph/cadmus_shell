import { Component, OnInit } from '@angular/core';
import {
  TokenTextPart,
  TOKEN_TEXT_PART_TYPEID,
  TokenTextLine,
} from '../token-text-part';
import { FormControl, FormBuilder, Validators } from '@angular/forms';
import { ModelEditorComponentBase } from '@myrmidon/cadmus-ui';
import { AuthService } from '@myrmidon/cadmus-api';
import { deepCopy } from '@myrmidon/cadmus-core';

/**
 * Editor component for base text, as referenced by token-based layers.
 * Thesauri: none.
 */
@Component({
  selector: 'cadmus-token-text-part',
  templateUrl: './token-text-part.component.html',
  styleUrls: ['./token-text-part.component.css'],
})
export class TokenTextPartComponent
  extends ModelEditorComponentBase<TokenTextPart>
  implements OnInit {
  public citation: FormControl;
  public text: FormControl;

  public editorOptions = {
    theme: 'vs-light',
    wordWrap: 'on',
    // https://github.com/atularen/ngx-monaco-editor/issues/19
    automaticLayout: true,
  };

  constructor(authService: AuthService, formBuilder: FormBuilder) {
    super(authService);
    // form
    this.citation = formBuilder.control(null);
    this.text = formBuilder.control(null, Validators.required);
    this.form = formBuilder.group({
      citation: this.citation,
      text: this.text,
    });
  }

  ngOnInit(): void {
    this.initEditor();
  }

  private getTextFromModel(model: TokenTextPart): string {
    if (!model || !model.lines) {
      return null;
    }
    return model.lines.map((l) => l.text).join('\n');
  }

  private getLinesFromText(text: string): TokenTextLine[] {
    // ensure that we just have LF rather than CRLF
    text = text.replace('\r\n', '\n');

    const lines: TokenTextLine[] = [];
    const textLines = text.split('\n');
    let y = 1;
    for (const line of textLines) {
      lines.push({
        y,
        text: line,
      });
      y++;
    }
    return lines;
  }

  private updateForm(model: TokenTextPart): void {
    if (!model) {
      this.form.reset();
      return;
    }
    this.citation.setValue(model.citation);
    this.text.setValue(this.getTextFromModel(model));
    this.form.markAsPristine();
  }

  protected onModelSet(model: TokenTextPart): void {
    this.updateForm(deepCopy(model));
  }

  protected getModelFromForm(): TokenTextPart {
    let part = this.model;
    if (!part) {
      part = {
        itemId: this.itemId,
        id: null,
        typeId: TOKEN_TEXT_PART_TYPEID,
        roleId: this.roleId,
        lines: null,
        timeCreated: new Date(),
        creatorId: null,
        timeModified: new Date(),
        userId: null,
      };
    }
    part.citation = this.citation.value ? this.citation.value.trim() : null;
    part.lines = this.getLinesFromText(this.text.value);
    return part;
  }
}
