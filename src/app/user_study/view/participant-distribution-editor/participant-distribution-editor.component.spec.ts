import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantDistributionEditorComponent } from './participant-distribution-editor.component';

describe('ParticipantDistributionEditorComponent', () => {
  let component: ParticipantDistributionEditorComponent;
  let fixture: ComponentFixture<ParticipantDistributionEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParticipantDistributionEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParticipantDistributionEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
