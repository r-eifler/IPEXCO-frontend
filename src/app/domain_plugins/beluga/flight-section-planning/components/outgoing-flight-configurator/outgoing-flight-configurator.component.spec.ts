import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutgoingFlightConfiguratorComponent } from './outgoing-flight-configurator.component';

describe('OutgoingFlightConfiguratorComponent', () => {
  let component: OutgoingFlightConfiguratorComponent;
  let fixture: ComponentFixture<OutgoingFlightConfiguratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OutgoingFlightConfiguratorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutgoingFlightConfiguratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
