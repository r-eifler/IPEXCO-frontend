import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { UserStudyDescriptionViewComponent } from "./user-study-description-view.component";

describe("UserStudyDescriptionViewComponent", () => {
  let component: UserStudyDescriptionViewComponent;
  let fixture: ComponentFixture<UserStudyDescriptionViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserStudyDescriptionViewComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserStudyDescriptionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
