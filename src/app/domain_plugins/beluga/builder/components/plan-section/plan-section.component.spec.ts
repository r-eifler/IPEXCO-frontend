import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanSectionComponent } from './plan-section.component';

describe('PlanSectionComponent', () => {
  let component: PlanSectionComponent;
  let fixture: ComponentFixture<PlanSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
