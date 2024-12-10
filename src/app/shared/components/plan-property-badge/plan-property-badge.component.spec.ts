import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanPropertyBadgeComponent } from './plan-property-badge.component';

describe('PlanPropertyBadgeComponent', () => {
  let component: PlanPropertyBadgeComponent;
  let fixture: ComponentFixture<PlanPropertyBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanPropertyBadgeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanPropertyBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
