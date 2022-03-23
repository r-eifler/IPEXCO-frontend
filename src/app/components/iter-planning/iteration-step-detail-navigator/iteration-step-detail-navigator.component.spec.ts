import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IterationStepDetailNavigatorComponent } from './iteration-step-detail-navigator.component';

describe('IterationStepDetailNavigatorComponent', () => {
  let component: IterationStepDetailNavigatorComponent;
  let fixture: ComponentFixture<IterationStepDetailNavigatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IterationStepDetailNavigatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IterationStepDetailNavigatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
