import { Component, input } from '@angular/core';
import { FlightSection } from '../../domain/flight-section';

@Component({
  selector: 'app-section-card',
  imports: [],
  templateUrl: './section-card.component.html',
  styleUrl: './section-card.component.scss'
})
export class SectionCardComponent {

  section = input.required<FlightSection>();
  highlighted = input<boolean>(false);

}
