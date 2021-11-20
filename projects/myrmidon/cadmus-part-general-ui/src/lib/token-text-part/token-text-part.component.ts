import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, Validators } from '@angular/forms';
import { take } from 'rxjs/operators';

import { ModelEditorComponentBase } from '@myrmidon/cadmus-ui';
import { AuthService } from '@myrmidon/cadmus-api';
import { deepCopy } from '@myrmidon/ng-tools';
import { DialogService } from '@myrmidon/ng-mat-tools';

import {
  TokenTextPart,
  TOKEN_TEXT_PART_TYPEID,
  TokenTextLine,
} from '../token-text-part';

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
  implements OnInit
{
  public citation: FormControl;
  public text: FormControl;

  public transform: FormControl;

  public editorOptions = {
    theme: 'vs-light',
    wordWrap: 'on',
    // https://github.com/atularen/ngx-monaco-editor/issues/19
    automaticLayout: true,
  };

  constructor(
    authService: AuthService,
    formBuilder: FormBuilder,
    private _dialogService: DialogService
  ) {
    super(authService);
    // form
    this.citation = formBuilder.control(null);
    this.text = formBuilder.control(null, Validators.required);
    this.form = formBuilder.group({
      citation: this.citation,
      text: this.text,
    });
    this.transform = formBuilder.control('ws');
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

  private normalizeWs(text: string): string {
    text = text.replace(/[ \t]+/g, ' ').trim();
    text = text.replace(/[ \t]+([\r\n])/g, '$1');
    text = text.replace(/([\r\n])[ \t]+/g, '$1');
    return text;
  }

  private splitAtStops(text: string): string {
    const crLf = text.indexOf('\r\n') > -1;
    const r = new RegExp('([.?!]+)', 'g');
    const parts: string[] = [];
    let start = 0;
    let m: RegExpExecArray | undefined;

    while ((m = r.exec(text))) {
      console.log(m[1].length);
      const end = m.index + m[1].length;
      if (end < text.length) {
        parts.push(text.substr(start, end - start));
        start = end;
      }
    }
    if (start < text.length) {
      parts.push(text.substr(start));
    }
    return parts.map((s) => s.trim()).join(crLf ? '\r\n' : '\n');
  }

  public applyTransform(): void {
    let name: string;
    switch (this.transform.value) {
      case 'ws':
        name = 'whitespace normalization';
        break;
      case 'split':
        name = 'text splitting';
        break;
      default:
        return;
    }

    this._dialogService
      .confirm('Transform Text', `Apply ${name}?`)
      .pipe(take(1))
      .subscribe((yes) => {
        if (yes) {
          let text: string = this.text.value || '';

          switch (this.transform.value) {
            case 'ws':
              text = this.normalizeWs(text);
              break;
            case 'split':
              text = this.splitAtStops(text);
              break;
          }
          this.text.setValue(text);
          this.form.markAsDirty();
        }
      });
  }
}
