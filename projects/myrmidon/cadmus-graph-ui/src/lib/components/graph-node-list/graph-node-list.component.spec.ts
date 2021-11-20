import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphNodeListComponent } from './graph-node-list.component';

describe('GraphNodeListComponent', () => {
  let component: GraphNodeListComponent;
  let fixture: ComponentFixture<GraphNodeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphNodeListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphNodeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
