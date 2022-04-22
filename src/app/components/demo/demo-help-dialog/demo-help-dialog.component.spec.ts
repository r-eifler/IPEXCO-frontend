import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { DemoHelpDialogComponent } from "./demo-help-dialog.component";

describe("DemoHelpDialogComponent", () => {
  let component: DemoHelpDialogComponent;
  let fixture: ComponentFixture<DemoHelpDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DemoHelpDialogComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoHelpDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
