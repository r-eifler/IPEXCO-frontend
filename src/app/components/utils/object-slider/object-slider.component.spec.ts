import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ObjectSliderComponent } from "./object-slider.component";

describe("ObjectSliderComponent", () => {
  let component: ObjectSliderComponent;
  let fixture: ComponentFixture<ObjectSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ObjectSliderComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
