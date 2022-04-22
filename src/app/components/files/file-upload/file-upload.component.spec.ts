import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { TemplateFileUploadComponent } from "./file-upload.component";

describe("TemplateFileUploadComponent", () => {
  let component: TemplateFileUploadComponent;
  let fixture: ComponentFixture<TemplateFileUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TemplateFileUploadComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
