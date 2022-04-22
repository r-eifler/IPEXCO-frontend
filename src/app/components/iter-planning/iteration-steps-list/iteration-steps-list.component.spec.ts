import { ComponentFixture, TestBed } from "@angular/core/testing";

import { IterationStepsListComponent } from "./iteration-steps-list.component";

describe("IterationStepsListComponent", () => {
  let component: IterationStepsListComponent;
  let fixture: ComponentFixture<IterationStepsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IterationStepsListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IterationStepsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
