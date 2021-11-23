import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphNodeEditorComponent } from './graph-node-editor.component';

describe('GraphNodeEditorComponent', () => {
  let component: GraphNodeEditorComponent;
  let fixture: ComponentFixture<GraphNodeEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphNodeEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphNodeEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
