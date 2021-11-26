import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphEditorFeatureComponent } from './graph-editor-feature.component';

describe('GraphEditorFeatureComponent', () => {
  let component: GraphEditorFeatureComponent;
  let fixture: ComponentFixture<GraphEditorFeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphEditorFeatureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphEditorFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
