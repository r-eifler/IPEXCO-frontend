import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutgoingFlightStateComponent } from './outgoing-flight-state.component';

describe('OutgoingFlightStateComponent', () => {
  let component: OutgoingFlightStateComponent;
  let fixture: ComponentFixture<OutgoingFlightStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OutgoingFlightStateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutgoingFlightStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
