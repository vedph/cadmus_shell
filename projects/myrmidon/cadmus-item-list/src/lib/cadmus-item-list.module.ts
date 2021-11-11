import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MomentModule } from 'ngx-moment';

import { CadmusMaterialModule } from '@myrmidon/cadmus-material';
import { CadmusApiModule } from '@myrmidon/cadmus-api';
import { CadmusUiModule } from '@myrmidon/cadmus-ui';
import { ItemListComponent } from './item-list/item-list.component';
import { ItemFilterComponent } from './item-filter/item-filter.component';
import { CadmusStateModule } from '@myrmidon/cadmus-state';
import { FlexLayoutModule } from '@angular/flex-layout';

// https://github.com/ng-packagr/ng-packagr/issues/778
export const RouterModuleForChild = RouterModule.forChild([
  { path: '', pathMatch: 'full', component: ItemListComponent },
]);

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModuleForChild,
    MomentModule,
    // cadmus
    FlexLayoutModule,
    CadmusApiModule,
    CadmusMaterialModule,
    CadmusUiModule,
    CadmusStateModule,
  ],
  declarations: [ItemListComponent, ItemFilterComponent],
  exports: [ItemListComponent],
})
export class CadmusItemListModule {}
