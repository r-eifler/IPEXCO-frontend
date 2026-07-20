import { ComponentFixture, TestBed } from "@angular/core/testing";
import { PlanPilotSidebarPlanComponent } from "./planpilot-sidebar-plan.component";

describe("PlanPilotSidebarPlanComponent", () => {
  let fixture: ComponentFixture<PlanPilotSidebarPlanComponent>;
  let component: PlanPilotSidebarPlanComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanPilotSidebarPlanComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(PlanPilotSidebarPlanComponent);
    component = fixture.componentInstance;
  });

  it("keeps plan-space settings visible and separates graph focus from action filtering", () => {
    component.timelineRows = [
      {
        key: 2,
        label: "t2",
        displayedActions: ["stack a b"],
        alternativeCount: 3,
        requiredCount: 0,
        forbiddenCount: 0,
      },
    ];
    component.timestepActionCounts = { 2: 3 };
    const focused: Array<number | "any"> = [];
    const filtered: Array<number | "any"> = [];
    component.timestepFocus.subscribe((value) => focused.push(value));
    component.timestepActions.subscribe((value) => filtered.push(value));
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector("#planpilot-settings"),
    ).not.toBeNull();
    expect(
      fixture.nativeElement.querySelector("details#planpilot-settings"),
    ).toBeNull();

    fixture.nativeElement.querySelector(".timeline-focus").click();
    expect(focused).toEqual([2]);
    expect(filtered).toEqual([]);

    fixture.nativeElement.querySelector(".timeline-show-actions").click();
    expect(filtered).toEqual([2]);
  });
});
