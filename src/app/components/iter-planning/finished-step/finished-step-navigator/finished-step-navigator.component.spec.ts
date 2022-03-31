import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishedStepNavigatorComponent } from './finished-step-navigator.component';

describe('FinishedStepNavigatorComponent', () => {
  let component: FinishedStepNavigatorComponent;
  let fixture: ComponentFixture<FinishedStepNavigatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinishedStepNavigatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinishedStepNavigatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
