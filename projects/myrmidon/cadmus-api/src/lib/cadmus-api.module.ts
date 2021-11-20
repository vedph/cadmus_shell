import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CadmusCoreModule } from '@myrmidon/cadmus-core';
import { EnvServiceProvider, NgToolsModule } from '@myrmidon/ng-tools';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    // cadmus
    CadmusCoreModule,
    NgToolsModule
  ],
  providers: [
    EnvServiceProvider
  ]
})
export class CadmusApiModule {}
