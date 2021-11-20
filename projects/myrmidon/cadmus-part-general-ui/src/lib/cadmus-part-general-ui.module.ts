import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MonacoEditorModule } from 'ngx-monaco-editor';
import { MarkdownModule } from 'ngx-markdown';

import { CadmusCoreModule } from '@myrmidon/cadmus-core';
import { CadmusMaterialModule } from '@myrmidon/cadmus-material';
import { CadmusUiModule } from '@myrmidon/cadmus-ui';
import { CadmusRefsDocReferencesModule } from '@myrmidon/cadmus-refs-doc-references';
import { NgToolsModule } from '@myrmidon/ng-tools';
import { NgMatToolsModule } from '@myrmidon/ng-mat-tools';

import { NotePartComponent } from './note-part/note-part.component';
import { TokenTextPartComponent } from './token-text-part/token-text-part.component';
import { BibAuthorsEditorComponent } from './bib-authors-editor/bib-authors-editor.component';
import { BibliographyEntryComponent } from './bibliography-entry/bibliography-entry.component';
import { BibliographyPartComponent } from './bibliography-part/bibliography-part.component';
import { CategoriesPartComponent } from './categories-part/categories-part.component';
import { KeywordsPartComponent } from './keywords-part/keywords-part.component';
import { HistoricalDatePartComponent } from './historical-date-part/historical-date-part.component';
import { IndexKeywordComponent } from './index-keyword/index-keyword.component';
import { IndexKeywordsPartComponent } from './index-keywords-part/index-keywords-part.component';
import { ChronologyFragmentComponent } from './chronology-fragment/chronology-fragment.component';
import { TiledTextPartComponent } from './tiled-text-part/tiled-text-part.component';
import { TextTileComponent } from './text-tile/text-tile.component';
import { TiledDataComponent } from './tiled-data/tiled-data.component';
import { CommentEditorComponent } from './comment-editor/comment-editor.component';
import { DocReferencesPartComponent } from './doc-references-part/doc-references-part.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MonacoEditorModule,
    MarkdownModule,
    // cadmus
    CadmusCoreModule,
    CadmusMaterialModule,
    CadmusUiModule,
    CadmusRefsDocReferencesModule,
    NgToolsModule,
    NgMatToolsModule,
  ],
  declarations: [
    BibAuthorsEditorComponent,
    BibliographyEntryComponent,
    BibliographyPartComponent,
    BibliographyPartComponent,
    CategoriesPartComponent,
    ChronologyFragmentComponent,
    CommentEditorComponent,
    DocReferencesPartComponent,
    HistoricalDatePartComponent,
    IndexKeywordComponent,
    IndexKeywordsPartComponent,
    KeywordsPartComponent,
    NotePartComponent,
    TextTileComponent,
    TiledTextPartComponent,
    TokenTextPartComponent,
    TiledDataComponent,
    IndexKeywordComponent,
    CommentEditorComponent,
  ],
  exports: [
    BibliographyPartComponent,
    CategoriesPartComponent,
    ChronologyFragmentComponent,
    CommentEditorComponent,
    DocReferencesPartComponent,
    HistoricalDatePartComponent,
    IndexKeywordComponent,
    IndexKeywordsPartComponent,
    KeywordsPartComponent,
    NotePartComponent,
    TiledDataComponent,
    TextTileComponent,
    TiledTextPartComponent,
    TokenTextPartComponent,
  ],
})
export class CadmusPartGeneralUiModule {}
