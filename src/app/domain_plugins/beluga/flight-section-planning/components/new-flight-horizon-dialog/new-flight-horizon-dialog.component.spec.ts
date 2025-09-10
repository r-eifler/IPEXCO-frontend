import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewFlightHorizonDialogComponent } from '../new-flight-horizon-dilog/new-flight-horizon-dilog.component';

describe('NewFlightHorizonDialogComponent', () => {
  let component: NewFlightHorizonDialogComponent;
  let fixture: ComponentFixture<NewFlightHorizonDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewFlightHorizonDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewFlightHorizonDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
