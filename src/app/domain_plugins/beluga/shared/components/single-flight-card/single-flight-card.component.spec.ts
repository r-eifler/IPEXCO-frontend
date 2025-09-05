import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleFlightCardComponent } from './single-flight-card.component';

describe('SingleFlightCardComponent', () => {
  let component: SingleFlightCardComponent;
  let fixture: ComponentFixture<SingleFlightCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleFlightCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleFlightCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
