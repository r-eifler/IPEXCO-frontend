import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PlanningTaskViewComponent } from "./planning-task-view.component";

describe("PlanningTaskViewComponent", () => {
  let component: PlanningTaskViewComponent;
  let fixture: ComponentFixture<PlanningTaskViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlanningTaskViewComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanningTaskViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
