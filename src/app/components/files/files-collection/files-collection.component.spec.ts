import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { FilesCollectionComponent } from "./files-collection.component";

describe("FilesCollectionComponent", () => {
  let component: FilesCollectionComponent;
  let fixture: ComponentFixture<FilesCollectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FilesCollectionComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilesCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
