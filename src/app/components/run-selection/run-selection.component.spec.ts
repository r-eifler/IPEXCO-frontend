import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RunSelectionComponent } from './run-selection.component';

describe('RunSelectionComponent', () => {
  let component: RunSelectionComponent;
  let fixture: ComponentFixture<RunSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RunSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RunSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
