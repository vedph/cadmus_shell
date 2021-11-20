import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MomentModule } from 'ngx-moment';

import { CadmusMaterialModule } from '@myrmidon/cadmus-material';
import { CadmusApiModule } from '@myrmidon/cadmus-api';
import { CadmusUiModule } from '@myrmidon/cadmus-ui';
import { CadmusStateModule } from '@myrmidon/cadmus-state';
import { NgToolsModule } from '@myrmidon/ng-tools';
import { NgMatToolsModule } from '@myrmidon/ng-mat-tools';

import { ItemQueryComponent } from './item-query/item-query.component';
import { ItemSearchComponent } from './item-search/item-search.component';

// https://github.com/ng-packagr/ng-packagr/issues/778
export const RouterModuleForChild = RouterModule.forChild([
  { path: '', pathMatch: 'full', component: ItemSearchComponent },
]);

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModuleForChild,
    MomentModule,
    // cadmus
    CadmusApiModule,
    CadmusMaterialModule,
    CadmusUiModule,
    CadmusStateModule,
    NgToolsModule,
    NgMatToolsModule
  ],
  declarations: [ItemQueryComponent, ItemSearchComponent],
  exports: [ItemQueryComponent, ItemSearchComponent],
})
export class CadmusItemSearchModule {}
