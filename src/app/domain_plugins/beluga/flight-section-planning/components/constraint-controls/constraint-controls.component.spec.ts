import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstraintControlsComponent } from './constraint-controls.component';

describe('ConstraintControlsComponent', () => {
  let component: ConstraintControlsComponent;
  let fixture: ComponentFixture<ConstraintControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConstraintControlsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConstraintControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
