import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IterationStepOverviewComponent } from './iteration-step-overview.component';

describe('IterationStepOverviewComponent', () => {
  let component: IterationStepOverviewComponent;
  let fixture: ComponentFixture<IterationStepOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IterationStepOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IterationStepOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
