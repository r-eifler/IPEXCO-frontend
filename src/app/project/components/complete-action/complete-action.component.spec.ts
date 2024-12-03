import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CompleteActionComponent } from "./complete-action.component";

describe("CompleteActionComponent", () => {
  let component: CompleteActionComponent;
  let fixture: ComponentFixture<CompleteActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompleteActionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompleteActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
