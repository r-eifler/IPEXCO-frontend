import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiFlightCardComponent } from './multi-flight-card.component';

describe('MultiFlightCardComponent', () => {
  let component: MultiFlightCardComponent;
  let fixture: ComponentFixture<MultiFlightCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiFlightCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultiFlightCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
