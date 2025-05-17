import { Component, computed, effect, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoModule } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { FlightSection } from '../../domain/flight-section';
import { createSuccessorFlightSection } from '../../state/flight-section-planning.actions';
import { selectActiveBranchLastSectionFinished, selectActiveBranchNumberFinishedFlights, selectActiveBranchSections, selectFlights, selectNumFlights } from '../../state/flight-section-planning.selector';
import { SectionCardComponent } from '../section-card/section-card.component';




@Component({
  selector: 'app-section-tree',
  imports: [
    SectionCardComponent,
    MatButtonModule,
    TranslocoModule,
  ],
  templateUrl: './section-tree.component.html',
  styleUrl: './section-tree.component.scss'
})
export class SectionTreeComponent {

  store = inject(Store);

  sections = this.store.selectSignal(selectActiveBranchSections);
  flights = this.store.selectSignal(selectFlights);
  lastSectionFinished = this.store.selectSignal(selectActiveBranchLastSectionFinished);

  numFlights = this.store.selectSignal(selectNumFlights);
  numFinishedFlights = this.store.selectSignal(selectActiveBranchNumberFinishedFlights);

  onNextFlightPlan(section: FlightSection){
    this.store.dispatch(createSuccessorFlightSection({section}))
  }

  hasNextFlight = computed(() => this.numFlights() > (this.numFinishedFlights() ?? 0))

  constructor(){
    effect(() => console.log("hasNext:" + this.hasNextFlight()))
  }
}
