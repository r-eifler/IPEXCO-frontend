import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { UserStudyCollectionComponent } from "./user-study-collection.component";

describe("UserStudySelectionComponent", () => {
  let component: UserStudyCollectionComponent;
  let fixture: ComponentFixture<UserStudyCollectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserStudyCollectionComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserStudyCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
