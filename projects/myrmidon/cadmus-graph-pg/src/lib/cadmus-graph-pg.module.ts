import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CadmusApiModule } from '@myrmidon/cadmus-api';
import { CadmusGraphUiModule } from '@myrmidon/cadmus-graph-ui';
import { CadmusMaterialModule } from '@myrmidon/cadmus-material';
import { NgMatToolsModule } from '@myrmidon/ng-mat-tools';
import { NgToolsModule } from '@myrmidon/ng-tools';

import { GraphEditorFeatureComponent } from './graph-editor-feature/graph-editor-feature.component';

// https://github.com/ng-packagr/ng-packagr/issues/778
export const RouterModuleForChild = RouterModule.forChild([
  {
    path: '',
    pathMatch: 'full',
    component: GraphEditorFeatureComponent,
  },
]);

@NgModule({
  declarations: [GraphEditorFeatureComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    RouterModuleForChild,
    ReactiveFormsModule,
    CadmusMaterialModule,
    CadmusApiModule,
    CadmusGraphUiModule,
    NgToolsModule,
    NgMatToolsModule,
  ],
  exports: [GraphEditorFeatureComponent],
})
export class CadmusGraphPgModule {}
