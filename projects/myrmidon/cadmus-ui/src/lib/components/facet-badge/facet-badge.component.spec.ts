import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FacetBadgeComponent } from './facet-badge.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CadmusMaterialModule } from '@myrmidon/cadmus-material';

describe('FacetBadgeComponent', () => {
  let component: FacetBadgeComponent;
  let fixture: ComponentFixture<FacetBadgeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, CadmusMaterialModule],
      declarations: [FacetBadgeComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacetBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
