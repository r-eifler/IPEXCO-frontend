import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanComparisonSelectorComponent } from './plan-comparison-selector.component';

describe('PlanComparisonSelectorComponent', () => {
  let component: PlanComparisonSelectorComponent;
  let fixture: ComponentFixture<PlanComparisonSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanComparisonSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanComparisonSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
