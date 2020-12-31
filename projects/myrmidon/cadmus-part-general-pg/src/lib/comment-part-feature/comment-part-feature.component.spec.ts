import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentPartFeatureComponent } from './comment-part-feature.component';

describe('CommentPartFeatureComponent', () => {
  let component: CommentPartFeatureComponent;
  let fixture: ComponentFixture<CommentPartFeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommentPartFeatureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentPartFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
