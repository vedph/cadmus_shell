import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThesaurusEditorFeatureComponent } from './thesaurus-editor-feature.component';

describe('ThesaurusEditorFeatureComponent', () => {
  let component: ThesaurusEditorFeatureComponent;
  let fixture: ComponentFixture<ThesaurusEditorFeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThesaurusEditorFeatureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThesaurusEditorFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
