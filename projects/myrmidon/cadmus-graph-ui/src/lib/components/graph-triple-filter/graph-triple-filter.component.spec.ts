import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphTripleFilterComponent } from './graph-triple-filter.component';

describe('GraphTripleFilterComponent', () => {
  let component: GraphTripleFilterComponent;
  let fixture: ComponentFixture<GraphTripleFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphTripleFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphTripleFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
