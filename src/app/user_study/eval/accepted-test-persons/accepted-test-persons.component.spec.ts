import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AcceptedTestPersonsComponent } from "./accepted-test-persons.component";

describe("AcceptedTestPersonsComponent", () => {
  let component: AcceptedTestPersonsComponent;
  let fixture: ComponentFixture<AcceptedTestPersonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AcceptedTestPersonsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceptedTestPersonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
