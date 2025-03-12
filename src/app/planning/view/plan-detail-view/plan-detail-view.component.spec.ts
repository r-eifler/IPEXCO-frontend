import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanDetailViewComponent } from './plan-detail-view.component';

describe('PlanDetailViewComponent', () => {
  let component: PlanDetailViewComponent;
  let fixture: ComponentFixture<PlanDetailViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanDetailViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
