import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExplanationsViewComponent } from './explanations-view.component';

describe('ExplanationsViewComponent', () => {
  let component: ExplanationsViewComponent;
  let fixture: ComponentFixture<ExplanationsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExplanationsViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExplanationsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
