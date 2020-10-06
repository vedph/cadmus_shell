import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CadmusCoreModule, PendingChangesGuard } from '@myrmidon/cadmus-core';
import { CadmusMaterialModule } from '@myrmidon/cadmus-material';
import { CadmusUiModule } from '@myrmidon/cadmus-ui';
import {
  CadmusPartGeneralUiModule,
  NOTE_PART_TYPEID,
  COMMENT_FRAGMENT_TYPEID,
  KEYWORDS_PART_TYPEID,
  TOKEN_TEXT_PART_TYPEID,
  HISTORICAL_DATE_PART_TYPEID,
  TILED_TEXT_PART_TYPEID,
  INDEX_KEYWORDS_PART_TYPEID,
  BIBLIOGRAPHY_PART_TYPEID,
} from '@myrmidon/cadmus-part-general-ui';
import { CadmusStateModule } from '@myrmidon/cadmus-state';

import { NotePartFeatureComponent } from './note-part-feature/note-part-feature.component';
import { CommentFragmentFeatureComponent } from './comment-fragment-feature/comment-fragment-feature.component';
import { TokenTextPartFeatureComponent } from './token-text-part-feature/token-text-part-feature.component';
import { CategoriesPartFeatureComponent } from './categories-part-feature/categories-part-feature.component';
import {
  CATEGORIES_PART_TYPEID,
  CHRONOLOGY_FRAGMENT_TYPEID,
} from '@myrmidon/cadmus-part-general-ui';
import { KeywordsPartFeatureComponent } from './keywords-part-feature/keywords-part-feature.component';
import { ChronologyFragmentFeatureComponent } from './chronology-fragment-feature/chronology-fragment-feature.component';
import { HistoricalDatePartFeatureComponent } from './historical-date-part-feature/historical-date-part-feature.component';
import { IndexKeywordsPartFeatureComponent } from './index-keywords-part-feature/index-keywords-part-feature.component';
import { TokenTextLayerPartFeatureComponent } from './token-text-layer-part-feature/token-text-layer-part-feature.component';
import { TiledTextPartFeatureComponent } from './tiled-text-part-feature/tiled-text-part-feature.component';
import { TiledTextLayerPartFeatureComponent } from './tiled-text-layer-part-feature/tiled-text-layer-part-feature.component';
import { BibliographyPartFeatureComponent } from './bibliography-part-feature/bibliography-part-feature.component';
import { CadmusUiPgModule } from '@myrmidon/cadmus-ui-pg';

// https://github.com/ng-packagr/ng-packagr/issues/778
export const RouterModuleForChild = RouterModule.forChild([
  {
    path: `${CATEGORIES_PART_TYPEID}/:pid`,
    pathMatch: 'full',
    component: CategoriesPartFeatureComponent,
    canDeactivate: [PendingChangesGuard],
  },
  {
    path: `${HISTORICAL_DATE_PART_TYPEID}/:pid`,
    pathMatch: 'full',
    component: HistoricalDatePartFeatureComponent,
    canDeactivate: [PendingChangesGuard],
  },
  {
    path: `${KEYWORDS_PART_TYPEID}/:pid`,
    pathMatch: 'full',
    component: KeywordsPartFeatureComponent,
    canDeactivate: [PendingChangesGuard],
  },
  {
    path: `${INDEX_KEYWORDS_PART_TYPEID}/:pid`,
    pathMatch: 'full',
    component: IndexKeywordsPartFeatureComponent,
    canDeactivate: [PendingChangesGuard],
  },
  {
    path: `${NOTE_PART_TYPEID}/:pid`,
    pathMatch: 'full',
    component: NotePartFeatureComponent,
    canDeactivate: [PendingChangesGuard],
  },
  {
    path: `${TOKEN_TEXT_PART_TYPEID}/:pid`,
    pathMatch: 'full',
    component: TokenTextPartFeatureComponent,
    canDeactivate: [PendingChangesGuard],
  },
  {
    path: `${TILED_TEXT_PART_TYPEID}/:pid`,
    pathMatch: 'full',
    component: TiledTextPartFeatureComponent,
    canDeactivate: [PendingChangesGuard],
  },
  {
    path: 'it.vedph.token-text-layer/:pid',
    pathMatch: 'full',
    component: TokenTextLayerPartFeatureComponent,
    canDeactivate: [PendingChangesGuard],
  },
  {
    path: 'it.vedph.tiled-text-layer/:pid',
    pathMatch: 'full',
    component: TiledTextLayerPartFeatureComponent,
    canDeactivate: [PendingChangesGuard],
  },
  {
    path: `fragment/:pid/${COMMENT_FRAGMENT_TYPEID}/:loc`,
    pathMatch: 'full',
    component: CommentFragmentFeatureComponent,
    canDeactivate: [PendingChangesGuard],
  },
  {
    path: `fragment/:pid/${CHRONOLOGY_FRAGMENT_TYPEID}/:loc`,
    pathMatch: 'full',
    component: ChronologyFragmentFeatureComponent,
    canDeactivate: [PendingChangesGuard],
  },
  {
    path: `${BIBLIOGRAPHY_PART_TYPEID}/:pid`,
    pathMatch: 'full',
    component: BibliographyPartFeatureComponent,
    canDeactivate: [PendingChangesGuard],
  },
]);

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModuleForChild,
    // cadmus
    CadmusCoreModule,
    CadmusMaterialModule,
    CadmusUiModule,
    CadmusPartGeneralUiModule,
    CadmusStateModule,
    CadmusUiPgModule,
  ],
  declarations: [
    BibliographyPartFeatureComponent,
    CategoriesPartFeatureComponent,
    ChronologyFragmentFeatureComponent,
    CommentFragmentFeatureComponent,
    HistoricalDatePartFeatureComponent,
    IndexKeywordsPartFeatureComponent,
    KeywordsPartFeatureComponent,
    NotePartFeatureComponent,
    TiledTextLayerPartFeatureComponent,
    TiledTextPartFeatureComponent,
    TokenTextLayerPartFeatureComponent,
    TokenTextPartFeatureComponent,
    BibliographyPartFeatureComponent,
  ],
  exports: [
    BibliographyPartFeatureComponent,
    CategoriesPartFeatureComponent,
    ChronologyFragmentFeatureComponent,
    CommentFragmentFeatureComponent,
    HistoricalDatePartFeatureComponent,
    IndexKeywordsPartFeatureComponent,
    KeywordsPartFeatureComponent,
    NotePartFeatureComponent,
    TiledTextLayerPartFeatureComponent,
    TiledTextPartFeatureComponent,
    TokenTextLayerPartFeatureComponent,
    TokenTextPartFeatureComponent,
  ],
})
export class CadmusPartGeneralPgModule {}
