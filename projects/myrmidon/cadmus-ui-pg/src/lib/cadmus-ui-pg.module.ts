import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MomentModule } from 'ngx-moment';

import { CadmusCoreModule } from '@myrmidon/cadmus-core';
import { CadmusMaterialModule } from '@myrmidon/cadmus-material';
import { CadmusStateModule } from '@myrmidon/cadmus-state';
import { CurrentItemBarComponent } from './components/current-item-bar/current-item-bar.component';
import { CurrentLayerPartBarComponent } from './components/current-layer-part-bar/current-layer-part-bar.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MomentModule,
    // cadmus
    CadmusCoreModule,
    CadmusMaterialModule,
    CadmusStateModule,
  ],
  declarations: [CurrentItemBarComponent, CurrentLayerPartBarComponent],
  exports: [CurrentItemBarComponent, CurrentLayerPartBarComponent],
})
export class CadmusUiPgModule {}
