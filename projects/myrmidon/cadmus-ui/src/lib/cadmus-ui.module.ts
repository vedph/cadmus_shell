import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Monaco
import { MonacoEditorModule } from 'ngx-monaco-editor';

// Cadmus
import { CadmusCoreModule } from '@myrmidon/cadmus-core';
import { CadmusMaterialModule } from '@myrmidon/cadmus-material';
import { NgToolsModule } from '@myrmidon/ng-tools';

import { CloseSaveButtonsComponent } from './components/close-save-buttons/close-save-buttons.component';
import { DocReferencesComponent } from './components/doc-references/doc-references.component';
import { ErrorListComponent } from './components/error-list/error-list.component';
import { FacetBadgeComponent } from './components/facet-badge/facet-badge.component';
import { FlagsBadgeComponent } from './components/flags-badge/flags-badge.component';
import { DatationEditorComponent } from './components/datation-editor/datation-editor.component';
import { DecoratedTokenTextComponent } from './components/decorated-token-text/decorated-token-text.component';
import { ExternalIdsComponent } from './components/external-ids/external-ids.component';
import { HistoricalDateEditorComponent } from './components/historical-date-editor/historical-date-editor.component';
import { LayerHintsComponent } from './components/layer-hints/layer-hints.component';
import { LoginComponent } from './components/login/login.component';
import { LookupPinComponent } from './components/lookup-pin/lookup-pin.component';
import { MultiEntrySelectorComponent } from './components/multi-entry-selector/multi-entry-selector.component';
import { PartBadgeComponent } from './components/part-badge/part-badge.component';
import { PasswordStrengthBarComponent } from './components/password-strength-bar/password-strength-bar.component';
import { PhysicalDimensionComponent } from './components/physical-dimension/physical-dimension.component';
import { PhysicalSizeComponent } from './components/physical-size/physical-size.component';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { ThesaurusTreeComponent } from './components/thesaurus-tree/thesaurus-tree.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    MonacoEditorModule,
    // cadmus
    CadmusCoreModule,
    CadmusMaterialModule,
    NgToolsModule,
  ],
  declarations: [
    CloseSaveButtonsComponent,
    DatationEditorComponent,
    DecoratedTokenTextComponent,
    DocReferencesComponent,
    ErrorListComponent,
    ExternalIdsComponent,
    FacetBadgeComponent,
    FlagsBadgeComponent,
    HistoricalDateEditorComponent,
    LayerHintsComponent,
    LoginComponent,
    LookupPinComponent,
    MultiEntrySelectorComponent,
    PartBadgeComponent,
    PasswordStrengthBarComponent,
    PhysicalDimensionComponent,
    PhysicalSizeComponent,
    SafeHtmlPipe,
    ThesaurusTreeComponent,
  ],
  exports: [
    CloseSaveButtonsComponent,
    DatationEditorComponent,
    DecoratedTokenTextComponent,
    DocReferencesComponent,
    ErrorListComponent,
    ExternalIdsComponent,
    FacetBadgeComponent,
    FlagsBadgeComponent,
    HistoricalDateEditorComponent,
    LayerHintsComponent,
    LoginComponent,
    LookupPinComponent,
    MultiEntrySelectorComponent,
    PartBadgeComponent,
    PasswordStrengthBarComponent,
    PhysicalDimensionComponent,
    PhysicalSizeComponent,
    SafeHtmlPipe,
    ThesaurusTreeComponent,
  ],
  // entryComponents: [
  //   ConfirmDialogComponent
  // ]
})
export class CadmusUiModule {}
