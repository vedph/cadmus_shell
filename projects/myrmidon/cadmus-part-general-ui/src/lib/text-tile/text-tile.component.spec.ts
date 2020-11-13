import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextTileComponent } from './text-tile.component';
import { CadmusUiModule } from '@myrmidon/cadmus-ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CadmusCoreModule } from '@myrmidon/cadmus-core';
import { CadmusMaterialModule } from '@myrmidon/cadmus-material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('TextTileComponent', () => {
  let component: TextTileComponent;
  let fixture: ComponentFixture<TextTileComponent>;

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
      declarations: [TextTileComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
