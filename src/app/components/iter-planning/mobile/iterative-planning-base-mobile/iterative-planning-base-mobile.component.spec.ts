import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {IterativePlanningBaseMobileComponent} from './iterative-planning-base-mobile.component';

describe('IterativePlanningBaseMobileComponent', () => {
  let component: IterativePlanningBaseMobileComponent;
  let fixture: ComponentFixture<IterativePlanningBaseMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IterativePlanningBaseMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IterativePlanningBaseMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
