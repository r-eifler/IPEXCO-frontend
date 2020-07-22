import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanSelectionQuestionViewComponent } from './plan-selection-question-view.component';

describe('PlanSelectionQuestionViewComponent', () => {
  let component: PlanSelectionQuestionViewComponent;
  let fixture: ComponentFixture<PlanSelectionQuestionViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanSelectionQuestionViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanSelectionQuestionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
