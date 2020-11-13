import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureApparatusFragmentDemoComponent } from './feature-apparatus-fragment-demo.component';

describe('FeatureApparatusFragmentDemoComponent', () => {
  let component: FeatureApparatusFragmentDemoComponent;
  let fixture: ComponentFixture<FeatureApparatusFragmentDemoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FeatureApparatusFragmentDemoComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeatureApparatusFragmentDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
