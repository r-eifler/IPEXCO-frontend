import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningTaskRelaxationsComponent } from './planning-task-relaxations.component';

describe('PlanningTaskRelaxationsComponent', () => {
  let component: PlanningTaskRelaxationsComponent;
  let fixture: ComponentFixture<PlanningTaskRelaxationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanningTaskRelaxationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanningTaskRelaxationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
