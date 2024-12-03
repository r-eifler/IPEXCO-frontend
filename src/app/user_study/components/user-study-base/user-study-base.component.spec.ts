import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { UserStudyBaseComponent } from "./user-study-base.component";

describe("UserStudyBaseComponent", () => {
  let component: UserStudyBaseComponent;
  let fixture: ComponentFixture<UserStudyBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserStudyBaseComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserStudyBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
