import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExplanationsSelectPreferenceViewComponent } from './explanations-select-preference-view.component';

describe('ExplanationsSelectPreferenceViewComponent', () => {
  let component: ExplanationsSelectPreferenceViewComponent;
  let fixture: ComponentFixture<ExplanationsSelectPreferenceViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExplanationsSelectPreferenceViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExplanationsSelectPreferenceViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
