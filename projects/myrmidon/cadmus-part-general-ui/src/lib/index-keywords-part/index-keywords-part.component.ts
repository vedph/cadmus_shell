import { Component, OnInit } from '@angular/core';
import { ModelEditorComponentBase } from '@myrmidon/cadmus-ui';
import { AuthService } from '@myrmidon/cadmus-api';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import {
  IndexKeywordsPart,
  IndexKeyword,
  INDEX_KEYWORDS_PART_TYPEID
} from '../index-keywords-part';
import { deepCopy, ThesaurusEntry } from '@myrmidon/cadmus-core';

/**
 * Index keywords part editor.
 * Thesauri: languages, keyword-indexes, keyword-tags.
 */
@Component({
  selector: 'cadmus-index-keywords-part',
  templateUrl: './index-keywords-part.component.html',
  styleUrls: ['./index-keywords-part.component.css']
})
export class IndexKeywordsPartComponent
  extends ModelEditorComponentBase<IndexKeywordsPart>
  implements OnInit {
  public keywords: IndexKeyword[];
  public editedKeyword: IndexKeyword;
  public tabIndex: number;
  // thesaurus
  public idxEntries: ThesaurusEntry[] | undefined;
  public langEntries: ThesaurusEntry[] | undefined;
  public tagEntries: ThesaurusEntry[] | undefined;
  // form
  public keywordCount: FormControl;

  constructor(authService: AuthService, formBuilder: FormBuilder) {
    super(authService);
    // form
    this.keywords = [];
    this.keywordCount = formBuilder.control(0, Validators.min(1));
    this.form = formBuilder.group({
      keywordCount: this.keywordCount
    });
    this.tabIndex = 0;
  }

  ngOnInit(): void {
    this.initEditor();
  }

  protected onThesauriSet(): void {
    let key = 'languages';
    if (this.thesauri && this.thesauri[key]) {
      this.langEntries = this.thesauri[key].entries;
    } else {
      this.langEntries = undefined;
    }
    key = 'keyword-indexes';
    if (this.thesauri && this.thesauri[key]) {
      this.idxEntries = this.thesauri[key].entries;
    } else {
      this.idxEntries = undefined;
    }
    key = 'keyword-tags';
    if (this.thesauri && this.thesauri[key]) {
      this.tagEntries = this.thesauri[key].entries;
    } else {
      this.tagEntries = undefined;
    }
  }

  private compareKeywords(a: IndexKeyword, b: IndexKeyword): number {
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
    // indexId
    if (!a.indexId && b.indexId) {
      return -1;
    }
    if (a.indexId && !b.indexId) {
      return 1;
    }
    let n: number;
    if (a.indexId && b.indexId) {
      n = a.indexId.localeCompare(b.indexId);
      if (n !== 0) {
        return n;
      }
    }
    n = a.language.localeCompare(b.language);
    if (n !== 0) {
      return n;
    }
    return a.value.localeCompare(b.value);
  }

  private updateForm(model: IndexKeywordsPart): void {
    if (!model) {
      this.form.reset();
      return;
    }

    const ck = Object.assign([], model.keywords);
    ck.sort(this.compareKeywords);
    this.keywords = ck;
    this.form.markAsPristine();
  }

  protected onModelSet(model: IndexKeywordsPart): void {
    this.updateForm(deepCopy(model));
  }

  protected getModelFromForm(): IndexKeywordsPart {
    let part = this.model;
    if (!part) {
      part = {
        itemId: this.itemId,
        id: null,
        typeId: INDEX_KEYWORDS_PART_TYPEID,
        roleId: this.roleId,
        timeCreated: new Date(),
        creatorId: null,
        timeModified: new Date(),
        userId: null,
        keywords: []
      };
    }
    part.keywords = [...this.keywords];
    return part;
  }

  private addKeyword(keyword: IndexKeyword): boolean {
    let i = 0;
    while (i < this.keywords.length) {
      const n = this.compareKeywords(keyword, this.keywords[i]);
      if (n === 0) {
        return false;
      }
      if (n <= 0) {
        const ck = Object.assign([], this.keywords);
        ck.splice(i, 0, keyword);
        this.form.markAsDirty();
        this.keywords = ck;
        break;
      }
      i++;
    }
    if (i === this.keywords.length) {
      const ck = Object.assign([], this.keywords);
      ck.push(keyword);
      this.form.markAsDirty();
      this.keywords = ck;
    }
    this.keywordCount.setValue(this.keywords.length);
    return true;
  }

  public addNewKeyword(): void {
    const keyword: IndexKeyword = {
      indexId: this.idxEntries?.length ? this.idxEntries[0].id : null,
      language: this.langEntries?.length ? this.langEntries[0].id : 'eng',
      value: ''
    };
    if (this.addKeyword(keyword)) {
      this.editKeyword(keyword);
    }
  }

  public deleteKeyword(keyword: IndexKeyword): void {
    const ck = Object.assign([], this.keywords);
    ck.splice(this.keywords.indexOf(keyword), 1);
    this.form.markAsDirty();
    this.keywords = ck;
    this.keywordCount.setValue(this.keywords.length);
  }

  public editKeyword(keyword: IndexKeyword): void {
    this.editedKeyword = keyword;
    this.tabIndex = 1;
  }

  public onKeywordClose(): void {
    this.tabIndex = 0;
    this.editedKeyword = null;
  }

  public onKeywordSave(keyword: IndexKeyword): void {
    this.tabIndex = 0;
    this.addKeyword(keyword);
    this.editedKeyword = null;
  }
}
