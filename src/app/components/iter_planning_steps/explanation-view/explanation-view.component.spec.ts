import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExplanationViewComponent } from './explanation-view.component';

describe('ExplanationViewComponent', () => {
  let component: ExplanationViewComponent;
  let fixture: ComponentFixture<ExplanationViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExplanationViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExplanationViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
