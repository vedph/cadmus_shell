import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BibliographyPartFeatureComponent } from './bibliography-part-feature.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CadmusUiModule } from '@myrmidon/cadmus-ui';
import { CadmusCoreModule } from '@myrmidon/cadmus-core';
import { CadmusMaterialModule } from '@myrmidon/cadmus-material';
import { BIBLIOGRAPHY_PART_TYPEID } from '@myrmidon/cadmus-part-general-ui';
import { CadmusStateModule } from '@myrmidon/cadmus-state';
import { CadmusUiPgModule } from '@myrmidon/cadmus-ui-pg';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { RouterTestingModule } from '@angular/router/testing';

describe('BibliographyPartFeatureComponent', () => {
  let component: BibliographyPartFeatureComponent;
  let fixture: ComponentFixture<BibliographyPartFeatureComponent>;

  beforeEach(async(() => {
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
        CadmusUiModule,
        CadmusStateModule,
        CadmusUiPgModule,
      ],
      declarations: [BibliographyPartFeatureComponent],
      providers: [
        {
          provide: 'partEditorKeys',
          useValue: {
            [BIBLIOGRAPHY_PART_TYPEID]: {
              part: 'general',
            },
          },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BibliographyPartFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
