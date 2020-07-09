import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PlanAnimationViewComponent} from './plan-animation-view.component';

describe('NomysteryPlanViewComponent', () => {
  let component: PlanAnimationViewComponent;
  let fixture: ComponentFixture<PlanAnimationViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanAnimationViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanAnimationViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
