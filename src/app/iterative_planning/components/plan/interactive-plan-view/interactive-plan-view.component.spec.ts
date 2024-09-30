import { ComponentFixture, TestBed } from "@angular/core/testing";

import { InteractivePlanViewComponent } from "./interactive-plan-view.component";

describe("InteractivePlanViewComponent", () => {
  let component: InteractivePlanViewComponent;
  let fixture: ComponentFixture<InteractivePlanViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InteractivePlanViewComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InteractivePlanViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
