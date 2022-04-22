import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { UserStudyEndComponent } from "./user-study-end.component";

describe("UserStudyEndComponent", () => {
  let component: UserStudyEndComponent;
  let fixture: ComponentFixture<UserStudyEndComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserStudyEndComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserStudyEndComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
