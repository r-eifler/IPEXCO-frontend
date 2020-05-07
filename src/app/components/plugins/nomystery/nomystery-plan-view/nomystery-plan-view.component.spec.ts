import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NomysteryPlanViewComponent } from './nomystery-plan-view.component';

describe('NomysteryPlanViewComponent', () => {
  let component: NomysteryPlanViewComponent;
  let fixture: ComponentFixture<NomysteryPlanViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NomysteryPlanViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NomysteryPlanViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
