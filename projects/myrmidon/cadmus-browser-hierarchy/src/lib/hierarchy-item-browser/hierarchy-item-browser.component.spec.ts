import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HierarchyItemBrowserComponent } from './hierarchy-item-browser.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { CadmusCoreModule } from '@myrmidon/cadmus-core';
import { CadmusApiModule } from '@myrmidon/cadmus-api';
import { CadmusMaterialModule } from '@myrmidon/cadmus-material';
import { CadmusUiModule } from '@myrmidon/cadmus-ui';
import { CadmusStateModule } from '@myrmidon/cadmus-state';
import { CadmusPartGeneralUiModule } from '@myrmidon/cadmus-part-general-ui';

describe('HierarchyItemBrowserComponent', () => {
  let component: HierarchyItemBrowserComponent;
  let fixture: ComponentFixture<HierarchyItemBrowserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterTestingModule,
        CadmusCoreModule,
        CadmusApiModule,
        CadmusCoreModule,
        CadmusMaterialModule,
        CadmusUiModule,
        CadmusPartGeneralUiModule,
        CadmusStateModule,
      ],
      declarations: [HierarchyItemBrowserComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HierarchyItemBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
