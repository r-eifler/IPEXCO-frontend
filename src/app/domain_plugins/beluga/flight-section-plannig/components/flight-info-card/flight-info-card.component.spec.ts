import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightInfoCardComponent } from './flight-info-card.component';

describe('FlightInfoCardComponent', () => {
  let component: FlightInfoCardComponent;
  let fixture: ComponentFixture<FlightInfoCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightInfoCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlightInfoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
