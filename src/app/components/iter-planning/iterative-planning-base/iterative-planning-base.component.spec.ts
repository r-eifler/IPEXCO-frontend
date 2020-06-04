import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IterativePlanningBaseComponent } from './iterative-planning-base.component';

describe('IterativePlanningBaseComponent', () => {
  let component: IterativePlanningBaseComponent;
  let fixture: ComponentFixture<IterativePlanningBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IterativePlanningBaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IterativePlanningBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
