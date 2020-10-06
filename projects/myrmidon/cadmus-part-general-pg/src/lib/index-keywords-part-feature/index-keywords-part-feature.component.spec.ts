import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IndexKeywordsPartFeatureComponent } from './index-keywords-part-feature.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { CadmusCoreModule } from '@myrmidon/cadmus-core';
import { CadmusMaterialModule } from '@myrmidon/cadmus-material';
import { CadmusUiModule } from '@myrmidon/cadmus-ui';
import {
  CadmusPartGeneralUiModule,
  INDEX_KEYWORDS_PART_TYPEID,
} from '@myrmidon/cadmus-part-general-ui';
import { CadmusStateModule } from '@myrmidon/cadmus-state';
import { CadmusUiPgModule } from '@myrmidon/cadmus-ui-pg';
import { RouterTestingModule } from '@angular/router/testing';

describe('IndexKeywordsPartFeatureComponent', () => {
  let component: IndexKeywordsPartFeatureComponent;
  let fixture: ComponentFixture<IndexKeywordsPartFeatureComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        NoopAnimationsModule,
        AkitaNgDevtools.forRoot(),
        CadmusCoreModule,
        CadmusMaterialModule,
        CadmusUiModule,
        CadmusPartGeneralUiModule,
        CadmusStateModule,
        CadmusUiPgModule,
      ],
      providers: [
        {
          provide: 'partEditorKeys',
          useValue: {
            [INDEX_KEYWORDS_PART_TYPEID]: {
              part: 'general',
            },
          },
        },
      ],
      declarations: [IndexKeywordsPartFeatureComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexKeywordsPartFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
