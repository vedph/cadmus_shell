import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CadmusCoreModule, PendingChangesGuard } from '@myrmidon/cadmus-core';
import { CadmusMaterialModule } from '@myrmidon/cadmus-material';
import { CadmusUiModule } from '@myrmidon/cadmus-ui';
import {
  CadmusPartPhilologyUiModule,
  APPARATUS_FRAGMENT_TYPEID,
  ORTHOGRAPHY_FRAGMENT_TYPEID,
  WITNESSES_FRAGMENT_TYPEID,
  QUOTATIONS_FRAGMENT_TYPEID,
} from '@myrmidon/cadmus-part-philology-ui';
import { CadmusStateModule } from '@myrmidon/cadmus-state';
import { CadmusUiPgModule } from '@myrmidon/cadmus-ui-pg';
import { NgToolsModule } from '@myrmidon/ng-tools';
import { NgMatToolsModule } from '@myrmidon/ng-mat-tools';

import { ApparatusFragmentFeatureComponent } from './apparatus-fragment-feature/apparatus-fragment-feature.component';
import { OrthographyFragmentFeatureComponent } from './orthography-fragment-feature/orthography-fragment-feature.component';
import { WitnessesFragmentFeatureComponent } from './witnesses-fragment-feature/witnesses-fragment-feature.component';
import { QuotationsFragmentFeatureComponent } from './quotations-fragment-feature/quotations-fragment-feature.component';

// https://github.com/ng-packagr/ng-packagr/issues/778
export const RouterModuleForChild = RouterModule.forChild([
  {
    path: `fragment/:pid/${APPARATUS_FRAGMENT_TYPEID}/:loc`,
    pathMatch: 'full',
    component: ApparatusFragmentFeatureComponent,
    canDeactivate: [PendingChangesGuard],
  },
  {
    path: `fragment/:pid/${ORTHOGRAPHY_FRAGMENT_TYPEID}/:loc`,
    pathMatch: 'full',
    component: OrthographyFragmentFeatureComponent,
    canDeactivate: [PendingChangesGuard],
  },
  {
    path: `fragment/:pid/${QUOTATIONS_FRAGMENT_TYPEID}/:loc`,
    pathMatch: 'full',
    component: QuotationsFragmentFeatureComponent,
    canDeactivate: [PendingChangesGuard],
  },
  {
    path: `fragment/:pid/${WITNESSES_FRAGMENT_TYPEID}/:loc`,
    pathMatch: 'full',
    component: WitnessesFragmentFeatureComponent,
    canDeactivate: [PendingChangesGuard],
  },
]);

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModuleForChild,
    // cadmus
    CadmusCoreModule,
    CadmusMaterialModule,
    CadmusUiModule,
    CadmusPartPhilologyUiModule,
    CadmusStateModule,
    CadmusUiPgModule,
    NgToolsModule,
    NgMatToolsModule,
  ],
  declarations: [
    ApparatusFragmentFeatureComponent,
    OrthographyFragmentFeatureComponent,
    QuotationsFragmentFeatureComponent,
    WitnessesFragmentFeatureComponent,
  ],
  exports: [
    ApparatusFragmentFeatureComponent,
    OrthographyFragmentFeatureComponent,
    QuotationsFragmentFeatureComponent,
    WitnessesFragmentFeatureComponent,
  ],
})
export class CadmusPartPhilologyPgModule {}
