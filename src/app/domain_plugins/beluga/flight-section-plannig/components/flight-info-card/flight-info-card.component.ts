import { Component, computed, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { LabelModule } from 'src/app/shared/components/label/label.module';
import { Flight } from '../../../shared/domain/beluga_problem';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-flight-info-card',
  imports: [
    MatCardModule, 
    MatChipsModule,  
    MatIconModule, 
    LabelModule, 
    MatButtonModule, 
    RouterLink, 
    MatTooltipModule, 
    MatProgressBarModule,
    TranslocoModule
  ],
  templateUrl: './flight-info-card.component.html',
  styleUrl: './flight-info-card.component.scss'
})
export class FlightInfoCardComponent {

  flight = input.required<Flight>();

  numOutgoing = computed(() => this.flight()?.outgoing.length ?? 0)
  numIncoming = computed(() => this.flight()?.incoming.length ?? 0)
}
