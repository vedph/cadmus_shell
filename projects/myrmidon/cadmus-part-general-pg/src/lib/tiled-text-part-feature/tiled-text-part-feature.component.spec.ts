import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TiledTextPartFeatureComponent } from './tiled-text-part-feature.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { MomentModule } from 'ngx-moment';
import { CadmusMaterialModule } from '@myrmidon/cadmus-material';
import { CadmusUiModule } from '@myrmidon/cadmus-ui';
import { CadmusUiPgModule } from '@myrmidon/cadmus-ui-pg';
import { CadmusCoreModule } from '@myrmidon/cadmus-core';
import {
  TILED_TEXT_PART_TYPEID,
  TiledDataComponent,
  TiledTextPartComponent,
  TextTileComponent,
} from '@myrmidon/cadmus-part-general-ui';

describe('TiledTextPartFeatureComponent', () => {
  let component: TiledTextPartFeatureComponent;
  let fixture: ComponentFixture<TiledTextPartFeatureComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        RouterTestingModule,
        AkitaNgDevtools.forRoot(),
        MomentModule,
        CadmusMaterialModule,
        CadmusCoreModule,
        CadmusUiModule,
        CadmusUiPgModule,
      ],
      providers: [
        {
          provide: 'partEditorKeys',
          useValue: {
            [TILED_TEXT_PART_TYPEID]: {
              part: 'general',
            },
          },
        },
      ],
      declarations: [
        TiledDataComponent,
        TextTileComponent,
        TiledTextPartComponent,
        TiledTextPartFeatureComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TiledTextPartFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
