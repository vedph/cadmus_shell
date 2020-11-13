import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureChronologyFragmentDemoComponent } from './feature-chronology-fragment-demo.component';

describe('FeatureChronologyFragmentDemoComponent', () => {
  let component: FeatureChronologyFragmentDemoComponent;
  let fixture: ComponentFixture<FeatureChronologyFragmentDemoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FeatureChronologyFragmentDemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeatureChronologyFragmentDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
