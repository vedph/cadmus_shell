import { async, ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CadmusMaterialModule } from '@myrmidon/cadmus-material';
import { HAMMER_LOADER } from '@angular/platform-browser';

import { OrthographyFragmentComponent } from './orthography-fragment.component';
import { MspOperationComponent } from '../msp-operation/msp-operation.component';
import { CadmusUiModule } from '@myrmidon/cadmus-ui';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('OrthographyFragmentComponent', () => {
  let component: OrthographyFragmentComponent;
  let fixture: ComponentFixture<OrthographyFragmentComponent>;

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
      // https://github.com/angular/components/issues/14668
      providers: [
        {
          provide: HAMMER_LOADER,
          useValue: () => new Promise(() => {}),
        },
        {
          provide: 'apiEndpoint',
          useValue: 'http://localhost:60380/api/',
        },
        {
          provide: 'databaseId',
          useValue: 'cadmus',
        },
      ],
      declarations: [MspOperationComponent, OrthographyFragmentComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrthographyFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
