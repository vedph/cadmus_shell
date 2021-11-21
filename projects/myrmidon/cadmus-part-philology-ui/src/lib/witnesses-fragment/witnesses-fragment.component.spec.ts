import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CadmusMaterialModule } from '@myrmidon/cadmus-material';

import { WitnessesFragmentComponent } from './witnesses-fragment.component';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { CadmusUiModule } from '@myrmidon/cadmus-ui';
import { MarkdownModule } from 'ngx-markdown';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('WitnessesFragmentComponent', () => {
  let component: WitnessesFragmentComponent;
  let fixture: ComponentFixture<WitnessesFragmentComponent>;

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
      declarations: [WitnessesFragmentComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WitnessesFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
