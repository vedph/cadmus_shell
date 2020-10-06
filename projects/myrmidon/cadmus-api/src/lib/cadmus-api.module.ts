import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CadmusCoreModule } from '@myrmidon/cadmus-core';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    // cadmus
    CadmusCoreModule,
  ],
})
export class CadmusApiModule {}
