import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MonacoEditorModule } from 'ngx-monaco-editor';
import { MarkdownModule } from 'ngx-markdown';

import { MspOperationComponent } from './msp-operation/msp-operation.component';
import { CadmusCoreModule } from '@myrmidon/cadmus-core';
import { CadmusMaterialModule } from '@myrmidon/cadmus-material';
import { CadmusUiModule } from '@myrmidon/cadmus-ui';
import { ApparatusEntryComponent } from './apparatus-entry/apparatus-entry.component';
import { ApparatusFragmentComponent } from './apparatus-fragment/apparatus-fragment.component';
import { ApparatusFragmentDemoComponent } from './apparatus-fragment-demo/apparatus-fragment-demo.component';
import { OrthographyFragmentComponent } from './orthography-fragment/orthography-fragment.component';
import { OrthographyFragmentDemoComponent } from './orthography-fragment-demo/orthography-fragment-demo.component';
import { QuotationEntryComponent } from './quotation-entry/quotation-entry.component';
import { QuotationsFragmentComponent } from './quotations-fragment/quotations-fragment.component';
import { QuotationsFragmentDemoComponent } from './quotations-fragment-demo/quotations-fragment-demo.component';
import { WitnessesFragmentComponent } from './witnesses-fragment/witnesses-fragment.component';
import { WitnessesFragmentDemoComponent } from './witnesses-fragment-demo/witnesses-fragment-demo.component';

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
  ],
  declarations: [
    ApparatusEntryComponent,
    ApparatusFragmentComponent,
    ApparatusFragmentDemoComponent,
    MspOperationComponent,
    OrthographyFragmentComponent,
    OrthographyFragmentDemoComponent,
    QuotationEntryComponent,
    QuotationsFragmentComponent,
    QuotationsFragmentDemoComponent,
    WitnessesFragmentComponent,
    WitnessesFragmentDemoComponent,
  ],
  exports: [
    ApparatusEntryComponent,
    ApparatusFragmentComponent,
    ApparatusFragmentDemoComponent,
    MspOperationComponent,
    OrthographyFragmentComponent,
    OrthographyFragmentDemoComponent,
    QuotationsFragmentComponent,
    QuotationsFragmentDemoComponent,
    WitnessesFragmentComponent,
    WitnessesFragmentDemoComponent,
  ],
})
export class CadmusPartPhilologyUiModule {}
