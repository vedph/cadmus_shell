import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CadmusMaterialModule } from '@myrmidon/cadmus-material';
import { CadmusUiModule } from '@myrmidon/cadmus-ui';
import { ThesaurusEditorComponent } from './components/thesaurus-editor/thesaurus-editor.component';
import { ThesaurusLookupComponent } from './components/thesaurus-lookup/thesaurus-lookup.component';
import { ThesaurusNodeComponent } from './components/thesaurus-node/thesaurus-node.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // cadmus
    CadmusMaterialModule,
    CadmusUiModule,
  ],
  declarations: [
    ThesaurusEditorComponent,
    ThesaurusLookupComponent,
    ThesaurusNodeComponent
  ],
  exports: [
    ThesaurusEditorComponent,
    ThesaurusLookupComponent,
    ThesaurusNodeComponent,
  ],
})
export class CadmusThesaurusUiModule {}
