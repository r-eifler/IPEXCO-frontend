import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanComparisonComponent } from './plan-comparison.component';

describe('PlanComparisonComponent', () => {
  let component: PlanComparisonComponent;
  let fixture: ComponentFixture<PlanComparisonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanComparisonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanComparisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
