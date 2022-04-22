import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UserStudyNavigationComponent } from "./user-study-navigation.component";

describe("UserStudyNavigationComponent", () => {
  let component: UserStudyNavigationComponent;
  let fixture: ComponentFixture<UserStudyNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserStudyNavigationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserStudyNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
