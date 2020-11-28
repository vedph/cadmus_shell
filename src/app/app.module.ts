import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';

// flex
import { FlexLayoutModule } from '@angular/flex-layout';
// ngx monaco
import { MonacoEditorModule } from 'ngx-monaco-editor';
// ngx markdown
import { MarkdownModule } from 'ngx-markdown';
// Akita
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';

import {
  CadmusCoreModule,
  PendingChangesGuard,
  EnvServiceProvider,
} from '@myrmidon/cadmus-core';
import { CadmusUiModule } from '@myrmidon/cadmus-ui';
import { CadmusPartGeneralUiModule } from '@myrmidon/cadmus-part-general-ui';
import { CadmusPartPhilologyUiModule } from '@myrmidon/cadmus-part-philology-ui';
import { HomeComponent } from './home/home.component';
import { CadmusMaterialModule } from '@myrmidon/cadmus-material';
import {
  AuthInterceptor,
  AdminGuardService,
  AuthGuardService,
  EditorGuardService,
} from '@myrmidon/cadmus-api';
import { PART_EDITOR_KEYS } from './part-editor-keys';
import { ITEM_BROWSER_KEYS } from './item-browser-keys';
import { INDEX_LOOKUP_DEFINITIONS } from './index-lookup-definitions';

@NgModule({
  declarations: [AppComponent, HomeComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot(
      [
        { path: '', redirectTo: 'home', pathMatch: 'full' },
        { path: 'home', component: HomeComponent },
        {
          path: 'login',
          loadChildren: () =>
            import('@myrmidon/cadmus-login').then(
              (module) => module.CadmusLoginModule
            ),
        },
        {
          path: 'demo/layers',
          loadChildren: () =>
            import('@myrmidon/cadmus-layer-demo').then(
              (module) => module.CadmusLayerDemoModule
            ),
        },
        {
          path: 'items',
          loadChildren: () =>
            import('@myrmidon/cadmus-item-list').then(
              (module) => module.CadmusItemListModule
            ),
          canActivate: [AuthGuardService],
        },
        {
          path: 'items/:id',
          loadChildren: () =>
            import('@myrmidon/cadmus-item-editor').then(
              (module) => module.CadmusItemEditorModule
            ),
          canActivate: [AuthGuardService],
          canDeactivate: [PendingChangesGuard],
        },
        {
          path: 'items/:iid/general',
          loadChildren: () =>
            import('@myrmidon/cadmus-part-general-pg').then(
              (module) => module.CadmusPartGeneralPgModule
            ),
          canActivate: [AuthGuardService],
        },
        {
          path: 'items/:iid/philology',
          loadChildren: () =>
            import('@myrmidon/cadmus-part-philology-pg').then(
              (module) => module.CadmusPartPhilologyPgModule
            ),
          canActivate: [AuthGuardService],
        },
        {
          path: 'thesauri',
          loadChildren: () =>
            import('@myrmidon/cadmus-thesaurus-list').then(
              (module) => module.CadmusThesaurusListModule
            ),
          canActivate: [EditorGuardService],
        },
        {
          path: 'thesauri/:id',
          loadChildren: () =>
            import('@myrmidon/cadmus-thesaurus-editor').then(
              (module) => module.CadmusThesaurusEditorModule
            ),
          canActivate: [EditorGuardService],
        },
        {
          path: 'admin',
          loadChildren: () =>
            import('@myrmidon/cadmus-admin').then(
              (module) => module.CadmusAdminModule
            ),
          canActivate: [AdminGuardService],
        },
        {
          path: 'user',
          loadChildren: () =>
            import('@myrmidon/cadmus-user').then(
              (module) => module.CadmusUserModule
            ),
          canActivate: [AuthGuardService],
        },
        {
          path: 'reset-password',
          loadChildren: () =>
            import('@myrmidon/cadmus-reset-password').then(
              (module) => module.CadmusResetPasswordModule
            ),
        },
        {
          path: 'item-browser/hierarchy',
          loadChildren: () =>
            import('@myrmidon/cadmus-browser-hierarchy').then(
              (module) => module.CadmusBrowserHierarchyModule
            ),
          canActivate: [AuthGuardService],
        },
        {
          path: 'search',
          loadChildren: () =>
            import('@myrmidon/cadmus-item-search').then(
              (module) => module.CadmusItemSearchModule
            ),
          canActivate: [AuthGuardService],
        },
        { path: '**', component: HomeComponent },
      ],
      {
        initialNavigation: 'enabled',
        useHash: true,
      }
    ),
    // flex
    FlexLayoutModule,
    // Monaco
    MonacoEditorModule.forRoot(),
    // markdown
    MarkdownModule.forRoot(),
    // Akita
    AkitaNgDevtools.forRoot(),
    // Cadmus
    CadmusCoreModule,
    CadmusMaterialModule,
    CadmusPartGeneralUiModule,
    CadmusPartPhilologyUiModule,
    CadmusUiModule,
  ],
  providers: [
    EnvServiceProvider,
    // parts and fragments type IDs to editor group keys mappings
    // https://github.com/nrwl/nx/issues/208#issuecomment-384102058
    // inject like: @Inject('partEditorKeys') partEditorKeys: PartEditorKeys
    {
      provide: 'partEditorKeys',
      useValue: PART_EDITOR_KEYS,
    },
    // index lookup definitions
    {
      provide: 'indexLookupDefinitions',
      useValue: INDEX_LOOKUP_DEFINITIONS,
    },
    // item browsers IDs to editor keys mappings
    // inject like: @Inject('itemBrowserKeys') itemBrowserKeys: { [key: string]: string }
    {
      provide: 'itemBrowserKeys',
      useValue: ITEM_BROWSER_KEYS,
    },
    // HTTP interceptor
    // https://medium.com/@ryanchenkie_40935/angular-authentication-using-the-http-client-and-http-interceptors-2f9d1540eb8
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
