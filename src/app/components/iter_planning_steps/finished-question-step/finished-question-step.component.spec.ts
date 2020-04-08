import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishedQuestionStepComponent } from './finished-question-step.component';

describe('FinishedQuestionStepComponent', () => {
  let component: FinishedQuestionStepComponent;
  let fixture: ComponentFixture<FinishedQuestionStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinishedQuestionStepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinishedQuestionStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
