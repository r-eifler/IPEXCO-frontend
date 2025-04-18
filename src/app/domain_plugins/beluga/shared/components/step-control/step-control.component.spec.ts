import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepControlComponent } from './step-control.component';

describe('StepControlComponent', () => {
  let component: StepControlComponent;
  let fixture: ComponentFixture<StepControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepControlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
