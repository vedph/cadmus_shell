import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CadmusMaterialModule } from '@myrmidon/cadmus-material';

import { CommentFragmentDemoComponent } from './comment-fragment-demo.component';
import { CommentFragmentComponent } from '../comment-fragment/comment-fragment.component';
import { CadmusUiModule } from '@myrmidon/cadmus-ui';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { MarkdownModule } from 'ngx-markdown';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('CommentFragmentDemoComponent', () => {
  let component: CommentFragmentDemoComponent;
  let fixture: ComponentFixture<CommentFragmentDemoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        MaterialModule,
        MonacoEditorModule.forRoot(),
        MarkdownModule.forRoot(),
        UiModule,
      ],
      declarations: [CommentFragmentComponent, CommentFragmentDemoComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentFragmentDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
