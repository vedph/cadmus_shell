import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiEntrySelectorComponent } from './multi-entry-selector.component';

describe('MultiEntrySelectorComponent', () => {
  let component: MultiEntrySelectorComponent;
  let fixture: ComponentFixture<MultiEntrySelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiEntrySelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiEntrySelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
