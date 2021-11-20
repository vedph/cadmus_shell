import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CadmusCoreModule } from '@myrmidon/cadmus-core';
import { CadmusMaterialModule } from '@myrmidon/cadmus-material';
import { CadmusUiModule } from '@myrmidon/cadmus-ui';
import { CadmusPartGeneralUiModule } from '@myrmidon/cadmus-part-general-ui';
import { CadmusStateModule } from '@myrmidon/cadmus-state';
import { NgToolsModule } from '@myrmidon/ng-tools';

import { HierarchyItemBrowserComponent } from './hierarchy-item-browser/hierarchy-item-browser.component';
import { HierarchyItemBrowserCanDeactivateGuard } from './hierarchy-item-browser/hierarchy-item-browser-guard';

// https://github.com/ng-packagr/ng-packagr/issues/778
export const RouterModuleForChild = RouterModule.forChild([
  {
    path: '',
    pathMatch: 'full',
    component: HierarchyItemBrowserComponent,
    canDeactivate: [HierarchyItemBrowserCanDeactivateGuard],
  },
]);

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // cadmus
    CadmusCoreModule,
    CadmusMaterialModule,
    CadmusUiModule,
    CadmusPartGeneralUiModule,
    CadmusStateModule,
    RouterModuleForChild,
    NgToolsModule,
  ],
  declarations: [HierarchyItemBrowserComponent],
  exports: [HierarchyItemBrowserComponent],
})
export class CadmusBrowserHierarchyModule {}
