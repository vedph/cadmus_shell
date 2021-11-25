import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphTripleEditorComponent } from './graph-triple-editor.component';

describe('GraphTripleEditorComponent', () => {
  let component: GraphTripleEditorComponent;
  let fixture: ComponentFixture<GraphTripleEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphTripleEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphTripleEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
