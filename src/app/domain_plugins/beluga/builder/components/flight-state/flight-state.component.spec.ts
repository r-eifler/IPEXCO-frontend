import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightStateComponent } from './flight-state.component';

describe('FlightStateComponent', () => {
  let component: FlightStateComponent;
  let fixture: ComponentFixture<FlightStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightStateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlightStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
