import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { UserStudyDemoViewComponent } from "./user-study-demo-view.component";

describe("UserStudyDemoViewComponent", () => {
  let component: UserStudyDemoViewComponent;
  let fixture: ComponentFixture<UserStudyDemoViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserStudyDemoViewComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserStudyDemoViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
