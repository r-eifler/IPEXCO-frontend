import { Component, input } from '@angular/core';
import { FlightPlanForest, FlightPlanForestZ } from '../../domain/flight-section';

@Component({
  selector: 'app-section-tree',
  imports: [],
  templateUrl: './section-tree.component.html',
  styleUrl: './section-tree.component.scss'
})
export class SectionTreeComponent {

  
  root = input.required<string>();
  forest = input.required<FlightPlanForest>();

  
}
