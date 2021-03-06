import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { CadmusCoreModule } from '@myrmidon/cadmus-core';
import { CadmusMaterialModule } from '@myrmidon/cadmus-material';
import { CadmusApiModule } from '@myrmidon/cadmus-api';
import { CadmusUiModule } from '@myrmidon/cadmus-ui';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

// https://github.com/ng-packagr/ng-packagr/issues/778
export const RouterModuleForChild = RouterModule.forChild([
  { path: '', pathMatch: 'full', component: ResetPasswordComponent },
]);

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModuleForChild,
    // cadmus
    CadmusCoreModule,
    CadmusMaterialModule,
    CadmusApiModule,
    CadmusUiModule,
  ],
  declarations: [ResetPasswordComponent],
  exports: [ResetPasswordComponent],
})
export class CadmusResetPasswordModule {}
