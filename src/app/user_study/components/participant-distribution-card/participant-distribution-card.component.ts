import { Component, inject, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ParticipantDistribution } from '../../domain/participant-distribution';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-participant-distribution-card',
    imports: [
        MatCardModule,
        MatIconModule,
        MatButtonModule
    ],
    templateUrl: './participant-distribution-card.component.html',
    styleUrl: './participant-distribution-card.component.scss'
})
export class ParticipantDistributionCardComponent {


  router = inject(Router);

  participantDistribution = input.required<ParticipantDistribution>();

  onDetails(){
    this.router.navigate(['user-study', 'distribution', this.participantDistribution()._id, 'details']);
  }
}
