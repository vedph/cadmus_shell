import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { DecoratedTokenTextComponent } from './decorated-token-text.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CadmusMaterialModule } from '@myrmidon/cadmus-material';
import { HAMMER_LOADER } from '@angular/platform-browser';
import { SafeHtmlPipe } from '../../pipes/safe-html.pipe';

describe('DecoratedTokenTextComponent', () => {
  let component: DecoratedTokenTextComponent;
  let fixture: ComponentFixture<DecoratedTokenTextComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        ReactiveFormsModule,
        CadmusMaterialModule,
      ],
      // https://github.com/angular/components/issues/14668
      providers: [
        {
          provide: HAMMER_LOADER,
          useValue: () => new Promise(() => {}),
        },
      ],
      declarations: [DecoratedTokenTextComponent, SafeHtmlPipe],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DecoratedTokenTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
