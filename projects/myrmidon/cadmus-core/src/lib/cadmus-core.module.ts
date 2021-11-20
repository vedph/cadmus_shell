import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { NgToolsModule } from '@myrmidon/ng-tools';

import { SortPipe } from './pipes/sort.pipe';

@NgModule({
  imports: [CommonModule, HttpClientModule, NgToolsModule],
  declarations: [SortPipe],
  exports: [SortPipe],
})
export class CadmusCoreModule {}
