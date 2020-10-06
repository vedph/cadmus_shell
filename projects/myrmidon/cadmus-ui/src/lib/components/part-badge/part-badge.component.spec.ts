import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PartBadgeComponent } from './part-badge.component';
import { CadmusApiModule } from '@myrmidon/cadmus-api';

describe('PartBadgeComponent', () => {
  let component: PartBadgeComponent;
  let fixture: ComponentFixture<PartBadgeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CadmusApiModule],
      declarations: [PartBadgeComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
