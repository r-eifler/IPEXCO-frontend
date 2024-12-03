import { ComponentFixture, TestBed } from "@angular/core/testing";

import { StudySelectionRedirectionComponent } from "./study-selection-redirection.component";

describe("StudySelectionRedirectionComponent", () => {
  let component: StudySelectionRedirectionComponent;
  let fixture: ComponentFixture<StudySelectionRedirectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudySelectionRedirectionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudySelectionRedirectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
