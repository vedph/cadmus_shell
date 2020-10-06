import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CadmusUiModule } from '@myrmidon/cadmus-ui';
import { CadmusMaterialModule } from '@myrmidon/cadmus-material';

import { LoginPageComponent } from './login-page/login-page.component';

// https://github.com/ng-packagr/ng-packagr/issues/778
export const RouterModuleForChild = RouterModule.forChild([
  { path: '', pathMatch: 'full', component: LoginPageComponent },
]);

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModuleForChild,
    // Cadmus
    CadmusMaterialModule,
    CadmusUiModule,
  ],
  declarations: [LoginPageComponent],
  exports: [LoginPageComponent],
})
export class CadmusLoginModule {}
