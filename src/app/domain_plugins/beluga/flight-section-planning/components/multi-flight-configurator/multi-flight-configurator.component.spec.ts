import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiFlightConfiguratorComponent } from './multi-flight-configurator.component';

describe('MultiFlightConfiguratorComponent', () => {
  let component: MultiFlightConfiguratorComponent;
  let fixture: ComponentFixture<MultiFlightConfiguratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiFlightConfiguratorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultiFlightConfiguratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
