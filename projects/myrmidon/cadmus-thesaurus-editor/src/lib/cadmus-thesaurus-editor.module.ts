import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CadmusMaterialModule } from '@myrmidon/cadmus-material';
import { CadmusApiModule } from '@myrmidon/cadmus-api';
import { CadmusUiModule } from '@myrmidon/cadmus-ui';
import { CadmusStateModule } from '@myrmidon/cadmus-state';
import { ThesaurusEditorComponent } from './thesaurus-editor/thesaurus-editor.component';
import { ThesaurusLookupComponent } from './thesaurus-lookup/thesaurus-lookup.component';
import { ThesaurusNodeComponent } from './thesaurus-node/thesaurus-node.component';

// https://github.com/ng-packagr/ng-packagr/issues/778
export const RouterModuleForChild = RouterModule.forChild([
  { path: '', pathMatch: 'full', component: ThesaurusEditorComponent },
]);

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModuleForChild,
    // cadmus
    CadmusApiModule,
    CadmusMaterialModule,
    CadmusUiModule,
    CadmusStateModule,
  ],
  declarations: [
    ThesaurusEditorComponent,
    ThesaurusLookupComponent,
    ThesaurusNodeComponent,
  ],
  exports: [
    ThesaurusEditorComponent,
    ThesaurusLookupComponent,
    ThesaurusNodeComponent,
  ],
})
export class CadmusThesaurusEditorModule {}
