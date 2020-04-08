import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningStepComponent } from './planning-step.component';

describe('PlanningStepComponent', () => {
  let component: PlanningStepComponent;
  let fixture: ComponentFixture<PlanningStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanningStepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanningStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
