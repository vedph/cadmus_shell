import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { CadmusCoreModule } from '@myrmidon/cadmus-core';
import { CadmusMaterialModule } from '@myrmidon/cadmus-material';
import { CadmusApiModule } from '@myrmidon/cadmus-api';
import { CadmusUiModule } from '@myrmidon/cadmus-ui';
import { AdminRegistrationComponent } from './admin-registration/admin-registration.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { UserEditorComponent } from './user-editor/user-editor.component';
import { UserManagerComponent } from './user-manager/user-manager.component';
import { UserFilterComponent } from './user-filter/user-filter.component';

// https://github.com/ng-packagr/ng-packagr/issues/778
export const RouterModuleForChild = RouterModule.forChild([
  {
    path: 'register',
    pathMatch: 'full',
    component: AdminRegistrationComponent,
  },
  {
    path: 'users',
    pathMatch: 'full',
    component: UserManagerComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    component: AdminHomeComponent,
  },
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
  declarations: [
    AdminHomeComponent,
    AdminRegistrationComponent,
    UserEditorComponent,
    UserManagerComponent,
    UserFilterComponent,
  ],
  exports: [
    AdminHomeComponent,
    AdminRegistrationComponent,
    UserEditorComponent,
    UserManagerComponent,
    UserFilterComponent,
  ],
})
export class CadmusAdminModule {}
