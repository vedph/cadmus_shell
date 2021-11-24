import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CadmusApiModule } from '@myrmidon/cadmus-api';
import { CadmusGraphUiModule } from '@myrmidon/cadmus-graph-ui';
import { CadmusMaterialModule } from '@myrmidon/cadmus-material';
import { NgMatToolsModule } from '@myrmidon/ng-mat-tools';
import { NgToolsModule } from '@myrmidon/ng-tools';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    CadmusMaterialModule,
    CadmusApiModule,
    CadmusGraphUiModule,
    NgToolsModule,
    NgMatToolsModule,
  ],
  exports: [],
})
export class CadmusGraphPgModule {}
