import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SelectedRelaxationsViewComponent } from "./selected-relaxations-view.component";

describe("SelectedRelaxationsViewComponent", () => {
  let component: SelectedRelaxationsViewComponent;
  let fixture: ComponentFixture<SelectedRelaxationsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectedRelaxationsViewComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedRelaxationsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
