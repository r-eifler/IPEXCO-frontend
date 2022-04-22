import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PlanningTaskRelaxationCreatorComponent } from "./planning-task-relaxation-creator.component";

describe("PlanningTaskRelaxationCreatorComponent", () => {
  let component: PlanningTaskRelaxationCreatorComponent;
  let fixture: ComponentFixture<PlanningTaskRelaxationCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlanningTaskRelaxationCreatorComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanningTaskRelaxationCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
