import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanFlightProgressComponent } from './plan-flight-progress.component';

describe('PlanFlightProgressComponent', () => {
  let component: PlanFlightProgressComponent;
  let fixture: ComponentFixture<PlanFlightProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanFlightProgressComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanFlightProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
