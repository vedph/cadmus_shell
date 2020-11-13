import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationsFragmentFeatureComponent } from './quotations-fragment-feature.component';
import {
  QUOTATIONS_FRAGMENT_TYPEID,
  QuotationsFragmentComponent,
  QuotationEntryComponent,
} from '@myrmidon/cadmus-part-philology-ui';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MomentModule } from 'ngx-moment';
import { CadmusMaterialModule } from '@myrmidon/cadmus-material';
import { CadmusUiModule } from '@myrmidon/cadmus-ui';
import { CurrentItemBarComponent } from '@myrmidon/cadmus-ui-pg';

describe('QuotationsFragmentFeatureComponent', () => {
  let component: QuotationsFragmentFeatureComponent;
  let fixture: ComponentFixture<QuotationsFragmentFeatureComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        BrowserAnimationsModule,
        MomentModule,
        CadmusMaterialModule,
        CadmusUiModule,
      ],
      providers: [
        {
          provide: 'partEditorKeys',
          useValue: {
            [QUOTATIONS_FRAGMENT_TYPEID]: {
              part: 'philology',
            },
          },
        },
      ],
      declarations: [
        CurrentItemBarComponent,
        QuotationEntryComponent,
        QuotationsFragmentComponent,
        QuotationsFragmentFeatureComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotationsFragmentFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
