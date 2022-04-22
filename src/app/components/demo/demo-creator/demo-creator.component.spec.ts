import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { DemoCreatorComponent } from "./demo-creator.component";

describe("DemoCreatorComponent", () => {
  let component: DemoCreatorComponent;
  let fixture: ComponentFixture<DemoCreatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DemoCreatorComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
