import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CadmusMaterialModule } from '@myrmidon/cadmus-material';

import { OrthographyFragmentDemoComponent } from './orthography-fragment-demo.component';
import { OrthographyFragmentComponent } from '../orthography-fragment/orthography-fragment.component';
import { MspOperationComponent } from '../msp-operation/msp-operation.component';
import { CadmusUiModule } from '@myrmidon/cadmus-ui';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NGX_MONACO_EDITOR_CONFIG } from 'ngx-monaco-editor';

describe('OrthographyFragmentDemoComponent', () => {
  let component: OrthographyFragmentDemoComponent;
  let fixture: ComponentFixture<OrthographyFragmentDemoComponent>;

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
          provide: NGX_MONACO_EDITOR_CONFIG,
          useValue: {},
        },
      ],
      declarations: [
        MspOperationComponent,
        OrthographyFragmentComponent,
        OrthographyFragmentDemoComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrthographyFragmentDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
