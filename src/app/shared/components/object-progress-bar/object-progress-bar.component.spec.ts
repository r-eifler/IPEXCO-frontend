import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ObjectProgressBarComponent } from "./object-progress-bar.component";

describe("ObjectProgressBarComponent", () => {
  let component: ObjectProgressBarComponent;
  let fixture: ComponentFixture<ObjectProgressBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ObjectProgressBarComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
