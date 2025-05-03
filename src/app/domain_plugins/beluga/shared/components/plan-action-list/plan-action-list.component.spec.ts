import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanActionListComponent } from './plan-action-list.component';

describe('PlanInspectionComponent', () => {
  let component: PlanActionListComponent;
  let fixture: ComponentFixture<PlanActionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanActionListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanActionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
