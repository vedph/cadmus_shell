import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CadmusMaterialModule } from '@myrmidon/cadmus-material';
import { CadmusApiModule } from '@myrmidon/cadmus-api';
import { CadmusUiModule } from '@myrmidon/cadmus-ui';
import { NgToolsModule } from '@myrmidon/ng-tools';
import { NgMatToolsModule } from '@myrmidon/ng-mat-tools';

import { ThesaurusFilterComponent } from './thesaurus-filter/thesaurus-filter.component';
import { ThesaurusListComponent } from './thesaurus-list/thesaurus-list.component';

// https://github.com/ng-packagr/ng-packagr/issues/778
export const RouterModuleForChild = RouterModule.forChild([
  { path: '', pathMatch: 'full', component: ThesaurusListComponent },
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
    NgToolsModule,
    NgMatToolsModule
  ],
  declarations: [ThesaurusListComponent, ThesaurusFilterComponent],
  exports: [ThesaurusListComponent],
})
export class CadmusThesaurusListModule {}
