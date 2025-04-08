import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BelugaFlightComponent } from './beluga-flight.component';

describe('BelugaFlightComponent', () => {
  let component: BelugaFlightComponent;
  let fixture: ComponentFixture<BelugaFlightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BelugaFlightComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BelugaFlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
