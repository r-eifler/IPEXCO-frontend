import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyTraceInspectionComponent } from './policy-trace-inspection.component';

describe('PolicyTraceInspectionComponent', () => {
  let component: PolicyTraceInspectionComponent;
  let fixture: ComponentFixture<PolicyTraceInspectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PolicyTraceInspectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolicyTraceInspectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
