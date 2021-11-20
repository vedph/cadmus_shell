import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphNodeLookupComponent } from './graph-node-lookup.component';

describe('GraphNodeLookupComponent', () => {
  let component: GraphNodeLookupComponent;
  let fixture: ComponentFixture<GraphNodeLookupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphNodeLookupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphNodeLookupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
