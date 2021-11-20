import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MonacoEditorModule } from 'ngx-monaco-editor';
import { MarkdownModule } from 'ngx-markdown';

import { CadmusCoreModule } from '@myrmidon/cadmus-core';
import { CadmusMaterialModule } from '@myrmidon/cadmus-material';
import { CadmusUiModule } from '@myrmidon/cadmus-ui';

import { MspOperationComponent } from './msp-operation/msp-operation.component';
import { ApparatusEntryComponent } from './apparatus-entry/apparatus-entry.component';
import { ApparatusFragmentComponent } from './apparatus-fragment/apparatus-fragment.component';
import { OrthographyFragmentComponent } from './orthography-fragment/orthography-fragment.component';
import { QuotationEntryComponent } from './quotation-entry/quotation-entry.component';
import { QuotationsFragmentComponent } from './quotations-fragment/quotations-fragment.component';
import { WitnessesFragmentComponent } from './witnesses-fragment/witnesses-fragment.component';
import { NgMatToolsModule } from '@myrmidon/ng-mat-tools';
import { NgToolsModule } from '@myrmidon/ng-tools';

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
    NgToolsModule,
    NgMatToolsModule
  ],
  declarations: [
    ApparatusEntryComponent,
    ApparatusFragmentComponent,
    MspOperationComponent,
    OrthographyFragmentComponent,
    QuotationEntryComponent,
    QuotationsFragmentComponent,
    WitnessesFragmentComponent,
  ],
  exports: [
    ApparatusEntryComponent,
    ApparatusFragmentComponent,
    MspOperationComponent,
    OrthographyFragmentComponent,
    QuotationsFragmentComponent,
    WitnessesFragmentComponent,
  ],
})
export class CadmusPartPhilologyUiModule {}
