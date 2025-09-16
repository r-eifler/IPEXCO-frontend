import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstraintsConflictIndicatorComponent } from '../constraint-controls/constraint-controls.component';

describe('ConstraintsConflictIndicatorComponent', () => {
  let component: ConstraintsConflictIndicatorComponent;
  let fixture: ComponentFixture<ConstraintsConflictIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConstraintsConflictIndicatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConstraintsConflictIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
