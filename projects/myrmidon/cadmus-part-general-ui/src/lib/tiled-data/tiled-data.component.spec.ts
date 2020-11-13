import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { TiledDataComponent } from './tiled-data.component';
import { CadmusUiModule } from '@myrmidon/cadmus-ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CadmusCoreModule } from '@myrmidon/cadmus-core';
import { CadmusMaterialModule } from '@myrmidon/cadmus-material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('TiledDataComponent', () => {
  let component: TiledDataComponent;
  let fixture: ComponentFixture<TiledDataComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        CadmusCoreModule,
        CadmusMaterialModule,
        CadmusUiModule,
      ],
      declarations: [TiledDataComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TiledDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
