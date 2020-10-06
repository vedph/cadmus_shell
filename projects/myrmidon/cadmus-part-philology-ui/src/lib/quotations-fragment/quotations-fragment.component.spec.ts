import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QuotationsFragmentComponent } from './quotations-fragment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule, JsonSchemaService } from '@myrmidon/cadmus-core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CadmusMaterialModule } from '@myrmidon/cadmus-material';
import { CadmusUiModule } from '@myrmidon/cadmus-ui';
import { QuotationEntryComponent } from '../quotation-entry/quotation-entry.component';

describe('QuotationsFragmentComponent', () => {
  let component: QuotationsFragmentComponent;
  let fixture: ComponentFixture<QuotationsFragmentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        CoreModule,
        NoopAnimationsModule,
        MaterialModule,
        UiModule,
      ],
      providers: [
        {
          provide: JsonSchemaService,
          useValue: {
            addSchema: () => {},
          },
        },
      ],
      declarations: [
        QuotationEntryComponent,
        QuotationsFragmentComponent
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotationsFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
