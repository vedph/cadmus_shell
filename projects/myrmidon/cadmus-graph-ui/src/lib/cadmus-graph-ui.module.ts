import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CadmusApiModule } from '@myrmidon/cadmus-api';
import { CadmusMaterialModule } from '@myrmidon/cadmus-material';

import { GraphNodeFilterComponent } from './components/graph-node-filter/graph-node-filter.component';
import { GraphNodeLookupComponent } from './components/graph-node-lookup/graph-node-lookup.component';

@NgModule({
  declarations: [GraphNodeFilterComponent, GraphNodeLookupComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    CadmusMaterialModule,
    CadmusApiModule,
  ],
  exports: [GraphNodeFilterComponent],
})
export class CadmusGraphUiModule {}
