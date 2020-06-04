import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishedPlanningStepComponent } from './finished-planning-step.component';

describe('FinishedPlanningStepComponent', () => {
  let component: FinishedPlanningStepComponent;
  let fixture: ComponentFixture<FinishedPlanningStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinishedPlanningStepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinishedPlanningStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
