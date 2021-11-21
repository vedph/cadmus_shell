import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { CadmusMaterialModule } from '@myrmidon/cadmus-material';
import { CadmusUiModule } from '@myrmidon/cadmus-ui';
import { CadmusCoreModule } from '@myrmidon/cadmus-core';

import { QuotationsFragmentComponent } from './quotations-fragment.component';
import { QuotationEntryComponent } from '../quotation-entry/quotation-entry.component';

describe('QuotationsFragmentComponent', () => {
  let component: QuotationsFragmentComponent;
  let fixture: ComponentFixture<QuotationsFragmentComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          FormsModule,
          ReactiveFormsModule,
          CadmusCoreModule,
          NoopAnimationsModule,
          CadmusMaterialModule,
          CadmusUiModule,
        ],
        declarations: [QuotationEntryComponent, QuotationsFragmentComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotationsFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
