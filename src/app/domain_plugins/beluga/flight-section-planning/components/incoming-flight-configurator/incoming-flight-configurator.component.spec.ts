import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomingFlightConfiguratorComponent } from './incoming-flight-configurator.component';

describe('IncomingFlightConfiguratorComponent', () => {
  let component: IncomingFlightConfiguratorComponent;
  let fixture: ComponentFixture<IncomingFlightConfiguratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncomingFlightConfiguratorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomingFlightConfiguratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
