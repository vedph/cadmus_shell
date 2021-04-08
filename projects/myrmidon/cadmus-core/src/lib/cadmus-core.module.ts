import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { SortPipe } from './pipes/sort.pipe';

@NgModule({
  imports: [CommonModule, HttpClientModule],
  declarations: [SortPipe],
  exports: [SortPipe]
})
export class CadmusCoreModule {}
