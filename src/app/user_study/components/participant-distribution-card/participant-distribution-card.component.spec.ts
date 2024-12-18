import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantDistributionCardComponent } from './participant-distribution-card.component';

describe('ParticipantDistributionCardComponent', () => {
  let component: ParticipantDistributionCardComponent;
  let fixture: ComponentFixture<ParticipantDistributionCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParticipantDistributionCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParticipantDistributionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
