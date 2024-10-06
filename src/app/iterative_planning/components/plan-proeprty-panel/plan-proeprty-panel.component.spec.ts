import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanProeprtyPanelComponent } from './plan-proeprty-panel.component';

describe('PlanProeprtyPanelComponent', () => {
  let component: PlanProeprtyPanelComponent;
  let fixture: ComponentFixture<PlanProeprtyPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanProeprtyPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanProeprtyPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
