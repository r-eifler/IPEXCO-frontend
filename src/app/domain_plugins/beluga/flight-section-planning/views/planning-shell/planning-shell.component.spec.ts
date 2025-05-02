import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningShellComponent } from './planning-shell.component';

describe('PlanningShellComponent', () => {
  let component: PlanningShellComponent;
  let fixture: ComponentFixture<PlanningShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanningShellComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanningShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
