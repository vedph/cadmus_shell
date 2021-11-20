import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphNodeFilterComponent } from './graph-node-filter.component';

describe('GraphNodeFilterComponent', () => {
  let component: GraphNodeFilterComponent;
  let fixture: ComponentFixture<GraphNodeFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphNodeFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphNodeFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
