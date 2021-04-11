import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LookupPinComponent } from './lookup-pin.component';

describe('LookupPinComponent', () => {
  let component: LookupPinComponent;
  let fixture: ComponentFixture<LookupPinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LookupPinComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LookupPinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
