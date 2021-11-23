import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CadmusApiModule } from '@myrmidon/cadmus-api';
import { CadmusMaterialModule } from '@myrmidon/cadmus-material';
import { NgToolsModule } from '@myrmidon/ng-tools';
import { NgMatToolsModule } from '@myrmidon/ng-mat-tools';

import { GraphNodeFilterComponent } from './components/graph-node-filter/graph-node-filter.component';
import { GraphNodeLookupComponent } from './components/graph-node-lookup/graph-node-lookup.component';
import { GraphNodeListComponent } from './components/graph-node-list/graph-node-list.component';
import { GraphNodeEditorComponent } from './components/graph-node-editor/graph-node-editor.component';

@NgModule({
  declarations: [
    GraphNodeFilterComponent,
    GraphNodeLookupComponent,
    GraphNodeListComponent,
    GraphNodeEditorComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    CadmusMaterialModule,
    CadmusApiModule,
    NgToolsModule,
    NgMatToolsModule
  ],
  exports: [
    GraphNodeFilterComponent,
    GraphNodeLookupComponent,
    GraphNodeListComponent,
    GraphNodeEditorComponent
  ],
})
export class CadmusGraphUiModule {}
