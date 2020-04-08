import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExplanationProcessComponent } from './explanation-process.component';

describe('ExplanationProcessComponent', () => {
  let component: ExplanationProcessComponent;
  let fixture: ComponentFixture<ExplanationProcessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExplanationProcessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExplanationProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
