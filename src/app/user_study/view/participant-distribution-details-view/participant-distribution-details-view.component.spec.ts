import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantDistributionDetailsViewComponent } from './participant-distribution-details-view.component';

describe('ParticipantDistributionDetailsViewComponent', () => {
  let component: ParticipantDistributionDetailsViewComponent;
  let fixture: ComponentFixture<ParticipantDistributionDetailsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParticipantDistributionDetailsViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParticipantDistributionDetailsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
