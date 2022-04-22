import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ScalableListComponent } from "./scalable-list.component";

describe("ScalableListComponent", () => {
  let component: ScalableListComponent;
  let fixture: ComponentFixture<ScalableListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ScalableListComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScalableListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
