import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ClipboardModule } from '@angular/cdk/clipboard';

import { MomentModule } from 'ngx-moment';

import { CadmusCoreModule } from '@myrmidon/cadmus-core';
import { CadmusMaterialModule } from '@myrmidon/cadmus-material';
import { CadmusApiModule } from '@myrmidon/cadmus-api';
import { CadmusUiModule } from '@myrmidon/cadmus-ui';
import { CadmusStateModule } from '@myrmidon/cadmus-state';
import { ItemEditorComponent } from './item-editor/item-editor.component';
import { PartsScopeEditorComponent } from './parts-scope-editor/parts-scope-editor.component';
import { MissingPartsComponent } from './missing-parts/missing-parts.component';

// https://github.com/ng-packagr/ng-packagr/issues/778
export const RouterModuleForChild = RouterModule.forChild([
  { path: '', pathMatch: 'full', component: ItemEditorComponent },
]);

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModuleForChild,
    ClipboardModule,
    MomentModule,
    // cadmus
    CadmusCoreModule,
    CadmusMaterialModule,
    CadmusApiModule,
    CadmusUiModule,
    CadmusStateModule,
  ],
  declarations: [
    ItemEditorComponent,
    MissingPartsComponent,
    PartsScopeEditorComponent,
  ],
  exports: [ItemEditorComponent],
})
export class CadmusItemEditorModule {}
