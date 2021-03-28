import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocReferencesPartFeatureComponent } from './doc-references-part-feature.component';

describe('DocReferencesPartFeatureComponent', () => {
  let component: DocReferencesPartFeatureComponent;
  let fixture: ComponentFixture<DocReferencesPartFeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocReferencesPartFeatureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocReferencesPartFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
