import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LayerHintsComponent } from './layer-hints.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CadmusMaterialModule } from '@myrmidon/cadmus-material';

describe('LayerHintsComponent', () => {
  let component: LayerHintsComponent;
  let fixture: ComponentFixture<LayerHintsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, CadmusMaterialModule],
      declarations: [LayerHintsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayerHintsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
