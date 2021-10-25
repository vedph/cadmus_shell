import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CadmusMaterialModule } from '@myrmidon/cadmus-material';
import { CadmusApiModule } from '@myrmidon/cadmus-api';
import { CadmusUiModule } from '@myrmidon/cadmus-ui';
import { CadmusStateModule } from '@myrmidon/cadmus-state';
import { ThesaurusEditorFeatureComponent } from './thesaurus-editor-feature/thesaurus-editor-feature.component';
import { CadmusThesaurusUiModule } from '@myrmidon/cadmus-thesaurus-ui';

// https://github.com/ng-packagr/ng-packagr/issues/778
export const RouterModuleForChild = RouterModule.forChild([
  { path: '', pathMatch: 'full', component: ThesaurusEditorFeatureComponent },
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
    CadmusStateModule,
    CadmusThesaurusUiModule,
    CadmusUiModule,
  ],
  declarations: [ThesaurusEditorFeatureComponent],
  exports: [ThesaurusEditorFeatureComponent],
})
export class CadmusThesaurusEditorModule {}
