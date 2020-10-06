import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CadmusMaterialModule } from '@myrmidon/cadmus-material';

import { WitnessesFragmentDemoComponent } from './witnesses-fragment-demo.component';
import { WitnessesFragmentComponent } from '../witnesses-fragment/witnesses-fragment.component';
import { CadmusUiModule } from '@myrmidon/cadmus-ui';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { MarkdownModule } from 'ngx-markdown';
import { JsonSchemaService } from '@myrmidon/cadmus-core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('WitnessesFragmentDemoComponent', () => {
  let component: WitnessesFragmentDemoComponent;
  let fixture: ComponentFixture<WitnessesFragmentDemoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        MonacoEditorModule.forRoot(),
        MarkdownModule.forRoot(),
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
      ],
      declarations: [
        WitnessesFragmentComponent,
        WitnessesFragmentDemoComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WitnessesFragmentDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
