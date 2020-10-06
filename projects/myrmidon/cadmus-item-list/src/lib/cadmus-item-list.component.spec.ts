import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadmusItemListComponent } from './cadmus-item-list.component';

describe('CadmusItemListComponent', () => {
  let component: CadmusItemListComponent;
  let fixture: ComponentFixture<CadmusItemListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CadmusItemListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CadmusItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
