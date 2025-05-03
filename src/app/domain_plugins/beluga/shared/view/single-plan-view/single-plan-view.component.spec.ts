import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SinglePlanViewComponent } from './single-plan-view.component';

describe('SinglePlanViewComponent', () => {
  let component: SinglePlanViewComponent;
  let fixture: ComponentFixture<SinglePlanViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SinglePlanViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SinglePlanViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
