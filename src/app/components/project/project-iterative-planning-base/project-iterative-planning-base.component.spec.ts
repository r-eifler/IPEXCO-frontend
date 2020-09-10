import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ProjectIterativePlanningBaseComponent} from './iterative-planning-base.component';

describe('IterativePlanningBaseComponent', () => {
  let component: ProjectIterativePlanningBaseComponent;
  let fixture: ComponentFixture<ProjectIterativePlanningBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectIterativePlanningBaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectIterativePlanningBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
