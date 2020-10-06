import { async, ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CadmusMaterialModule } from '@myrmidon/cadmus-material';

import { ApparatusFragmentDemoComponent } from './apparatus-fragment-demo.component';
import { ApparatusFragmentComponent } from '../apparatus-fragment/apparatus-fragment.component';
import { CadmusUiModule } from '@myrmidon/cadmus-ui';
import { JsonSchemaService } from '@myrmidon/cadmus-core';
import { ApparatusEntryComponent } from '../apparatus-entry/apparatus-entry.component';
import { NGX_MONACO_EDITOR_CONFIG } from 'ngx-monaco-editor';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ApparatusFragmentDemoComponent', () => {
  let component: ApparatusFragmentDemoComponent;
  let fixture: ComponentFixture<ApparatusFragmentDemoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        CadmusMaterialModule,
        CadmusUiModule,
      ],
      providers: [
        {
          provide: JsonSchemaService,
          useValue: {
            addSchema: () => {},
          },
        },
        {
          provide: NGX_MONACO_EDITOR_CONFIG,
          useValue: {},
        },
      ],
      declarations: [
        ApparatusEntryComponent,
        ApparatusFragmentComponent,
        ApparatusFragmentDemoComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApparatusFragmentDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
