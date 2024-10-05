import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IterationStepCardComponent } from './iteration-step-card.component';

describe('IterationStepCardComponent', () => {
  let component: IterationStepCardComponent;
  let fixture: ComponentFixture<IterationStepCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IterationStepCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IterationStepCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
