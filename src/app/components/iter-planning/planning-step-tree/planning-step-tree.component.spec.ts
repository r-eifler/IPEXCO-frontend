import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { PlanningStepTreeComponent } from "./planning-step-tree.component";

describe("PlanningStepTreeComponent", () => {
  let component: PlanningStepTreeComponent;
  let fixture: ComponentFixture<PlanningStepTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PlanningStepTreeComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanningStepTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
