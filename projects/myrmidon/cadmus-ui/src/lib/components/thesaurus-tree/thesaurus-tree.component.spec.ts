import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThesaurusTreeComponent } from './thesaurus-tree.component';

describe('ThesaurusTreeComponent', () => {
  let component: ThesaurusTreeComponent;
  let fixture: ComponentFixture<ThesaurusTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThesaurusTreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThesaurusTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
