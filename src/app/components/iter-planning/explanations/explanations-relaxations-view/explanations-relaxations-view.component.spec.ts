import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExplanationsRelaxationsViewComponent } from './explanations-relaxations-view.component';

describe('ExplanationsRelaxationsViewComponent', () => {
  let component: ExplanationsRelaxationsViewComponent;
  let fixture: ComponentFixture<ExplanationsRelaxationsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExplanationsRelaxationsViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExplanationsRelaxationsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
