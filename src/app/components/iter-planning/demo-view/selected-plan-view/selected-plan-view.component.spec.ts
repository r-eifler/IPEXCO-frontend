import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedPlanViewComponent } from './selected-plan-view.component';

describe('SelectedPlanViewComponent', () => {
  let component: SelectedPlanViewComponent;
  let fixture: ComponentFixture<SelectedPlanViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectedPlanViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedPlanViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
