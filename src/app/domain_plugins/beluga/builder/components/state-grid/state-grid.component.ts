import { Component } from '@angular/core';
import { FlightStateComponent } from '../flight-state/flight-state.component';
import { HangarsStateComponent } from '../hangars-state/hangars-state.component';
import { ProductionLineStateComponent } from '../production-line-state/production-line-state.component';
import { RacksStateComponent } from '../racks-state/racks-state.component';
import { TrailersStateComponent } from '../trailers-state/trailers-state.component';
import { PlanSectionComponent } from '../plan-section/plan-section.component';

@Component({
  selector: 'app-state-grid',
  imports: [
    HangarsStateComponent,
    FlightStateComponent,
    ProductionLineStateComponent,
    RacksStateComponent,
    TrailersStateComponent,
    PlanSectionComponent
  ],
  templateUrl: './state-grid.component.html',
  styleUrl: './state-grid.component.scss'
})
export class StateGridComponent {

}
