import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphTripleListComponent } from './graph-triple-list.component';

describe('GraphTripleListComponent', () => {
  let component: GraphTripleListComponent;
  let fixture: ComponentFixture<GraphTripleListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphTripleListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphTripleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
