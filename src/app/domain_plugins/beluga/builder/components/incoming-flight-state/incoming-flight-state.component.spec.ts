import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomingFlightStateComponent } from './incoming-flight-state.component';

describe('IncomingFlightStateComponent', () => {
  let component: IncomingFlightStateComponent;
  let fixture: ComponentFixture<IncomingFlightStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncomingFlightStateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomingFlightStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
