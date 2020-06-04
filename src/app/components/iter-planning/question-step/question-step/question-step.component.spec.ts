import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionStepComponent } from './question-step.component';

describe('QuestionStepComponent', () => {
  let component: QuestionStepComponent;
  let fixture: ComponentFixture<QuestionStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionStepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
