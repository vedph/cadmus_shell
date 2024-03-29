import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  Validators,
  FormGroup,
} from '@angular/forms';

import { ModelEditorComponentBase } from '@myrmidon/cadmus-ui';
import { ThesaurusEntry } from '@myrmidon/cadmus-core';
import { deepCopy } from '@myrmidon/ng-tools';
import { AuthService } from '@myrmidon/cadmus-api';

import { KeywordsPart, Keyword, KEYWORDS_PART_TYPEID } from '../keywords-part';

/**
 * Keywords editor component.
 * Thesauri: languages.
 */
@Component({
  selector: 'cadmus-keywords-part',
  templateUrl: './keywords-part.component.html',
  styleUrls: ['./keywords-part.component.css'],
})
export class KeywordsPartComponent
  extends ModelEditorComponentBase<KeywordsPart>
  implements OnInit
{
  public keywords: FormControl;
  // new keyword form
  public newLanguage: FormControl;
  public newValue: FormControl;
  public newForm: FormGroup;
  // thesaurus
  public langEntries?: ThesaurusEntry[];

  constructor(authService: AuthService, formBuilder: FormBuilder) {
    super(authService);
    // form
    this.keywords = formBuilder.control([], Validators.required);
    this.form = formBuilder.group({
      keywords: this.keywords,
    });
    // new keyword form
    this.newLanguage = formBuilder.control('eng', Validators.required);
    this.newValue = formBuilder.control(null, [
      Validators.required,
      Validators.maxLength(100),
    ]);
    this.newForm = formBuilder.group({
      newLanguage: this.newLanguage,
      newValue: this.newValue,
    });
  }

  ngOnInit(): void {
    this.initEditor();
  }

  protected onThesauriSet(): void {
    const key = 'languages';
    if (this.thesauri && this.thesauri[key]) {
      this.langEntries = this.thesauri[key].entries;
    } else {
      this.langEntries = undefined;
    }
  }

  private compareKeywords(a: Keyword, b: Keyword): number {
    if (!a) {
      if (!b) {
        return 0;
      } else {
        return -1;
      }
    }
    if (!b) {
      return 1;
    }
    const n = a.language.localeCompare(b.language);
    if (n !== 0) {
      return n;
    }
    return a.value.localeCompare(b.value);
  }

  private updateForm(model: KeywordsPart): void {
    if (!model) {
      this.form!.reset();
      return;
    }

    const ck = Object.assign([], model.keywords);
    ck.sort(this.compareKeywords);
    this.keywords.setValue(ck);
    this.form!.markAsPristine();
  }

  protected onModelSet(model: KeywordsPart): void {
    this.updateForm(deepCopy(model));
  }

  protected getModelFromForm(): KeywordsPart {
    let part = this.model;
    if (!part) {
      part = {
        itemId: this.itemId || '',
        id: '',
        typeId: KEYWORDS_PART_TYPEID,
        roleId: this.roleId,
        timeCreated: new Date(),
        creatorId: '',
        timeModified: new Date(),
        userId: '',
        keywords: [],
      };
    }
    part.keywords = [...this.keywords.value];
    return part;
  }

  public addKeyword(): void {
    if (this.newForm.invalid) {
      return;
    }
    const keyword: Keyword = {
      language: this.newLanguage.value,
      value: this.newValue.value,
    };
    let i = 0;
    while (i < this.keywords.value?.length || 0) {
      const n = this.compareKeywords(keyword, this.keywords.value[i]);
      if (n === 0) {
        return;
      }
      if (n <= 0) {
        const ck = Object.assign([], this.keywords.value);
        ck.splice(i, 0, keyword);
        this.keywords.setValue(ck);
        this.keywords.markAsDirty();
        break;
      }
      i++;
    }
    if (i === this.keywords.value.length) {
      const ck = Object.assign([], this.keywords.value);
      ck.push(keyword);
      this.keywords.setValue(ck);
      this.keywords.markAsDirty();
    }
  }

  public deleteKeyword(keyword: Keyword): void {
    const ck = Object.assign([], this.keywords.value);
    ck.splice(this.keywords.value.indexOf(keyword), 1);
    this.keywords.setValue(ck);
    this.keywords.markAsDirty();
  }
}
