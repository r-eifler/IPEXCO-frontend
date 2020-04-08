import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstPlanningStepComponent } from './first-planning-step.component';

describe('FirstPlanningStepComponent', () => {
  let component: FirstPlanningStepComponent;
  let fixture: ComponentFixture<FirstPlanningStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FirstPlanningStepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirstPlanningStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
