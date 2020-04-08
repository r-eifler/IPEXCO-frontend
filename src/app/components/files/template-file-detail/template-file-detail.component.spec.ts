import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateFileDetailComponent } from './template-file-detail.component';

describe('TemplateFileDetailComponent', () => {
  let component: TemplateFileDetailComponent;
  let fixture: ComponentFixture<TemplateFileDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateFileDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateFileDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
