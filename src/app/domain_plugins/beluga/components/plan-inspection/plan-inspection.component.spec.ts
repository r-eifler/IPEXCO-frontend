import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanInspectionComponent } from './plan-inspection.component';

describe('PlanInspectionComponent', () => {
  let component: PlanInspectionComponent;
  let fixture: ComponentFixture<PlanInspectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanInspectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanInspectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
