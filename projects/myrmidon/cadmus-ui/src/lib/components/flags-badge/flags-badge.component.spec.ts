import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FlagsBadgeComponent } from './flags-badge.component';
import { CadmusMaterialModule } from '@myrmidon/cadmus-material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('FlagsBadgeComponent', () => {
  let component: FlagsBadgeComponent;
  let fixture: ComponentFixture<FlagsBadgeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, CadmusMaterialModule],
      declarations: [FlagsBadgeComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlagsBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
