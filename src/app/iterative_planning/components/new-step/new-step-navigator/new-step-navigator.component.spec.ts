import { ComponentFixture, TestBed } from "@angular/core/testing";

import { NewStepNavigatorComponent } from "./new-step-navigator.component";

describe("NewStepNavigatorComponent", () => {
  let component: NewStepNavigatorComponent;
  let fixture: ComponentFixture<NewStepNavigatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewStepNavigatorComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewStepNavigatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
