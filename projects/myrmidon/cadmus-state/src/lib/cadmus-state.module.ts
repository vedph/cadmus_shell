import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CadmusApiModule } from '@myrmidon/cadmus-api';
import { CadmusCoreModule } from '@myrmidon/cadmus-core';
import { CadmusMaterialModule } from '@myrmidon/cadmus-material';
import { NgToolsModule } from '@myrmidon/ng-tools';

@NgModule({
  imports: [
    CommonModule,
    // Cadmus
    CadmusCoreModule,
    CadmusApiModule,
    CadmusMaterialModule,
    NgToolsModule
  ],
})
export class CadmusStateModule {}
