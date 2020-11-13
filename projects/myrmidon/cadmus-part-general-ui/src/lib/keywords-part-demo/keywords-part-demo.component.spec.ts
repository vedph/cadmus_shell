import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CadmusMaterialModule } from '@myrmidon/cadmus-material';
import { KeywordsPartDemoComponent } from './keywords-part-demo.component';
import { KeywordsPartComponent } from '../keywords-part/keywords-part.component';
import { UiModule } from '@myrmidon/cadmus-ui';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NGX_MONACO_EDITOR_CONFIG } from 'ngx-monaco-editor';

describe('KeywordsPartDemoComponent', () => {
  let component: KeywordsPartDemoComponent;
  let fixture: ComponentFixture<KeywordsPartDemoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        MaterialModule,
        UiModule,
      ],
      declarations: [KeywordsPartComponent, KeywordsPartDemoComponent],
      providers: [
        {
          provide: NGX_MONACO_EDITOR_CONFIG,
          useValue: {},
        },
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeywordsPartDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
