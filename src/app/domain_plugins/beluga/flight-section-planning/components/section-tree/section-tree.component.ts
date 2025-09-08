import { Component, computed, effect, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoModule } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { createSuccessorFlightsHorizon } from '../../state/flight-section-planning.actions';
import { selectActiveBranchLastSectionFinished, selectActiveBranchNumberFinishedFlights, selectActiveBranchSections, selectFlights, selectNumFlights } from '../../state/flight-section-planning.selector';
import { SectionCardComponent } from '../section-card/section-card.component';
import { FlightsHorizon } from '../../domain/flight-section';




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

  onNextFlightPlan(section: FlightsHorizon){
    // TODO also get flights indices and order
    console.log("TODO")
    // this.store.dispatch(createSuccessorFlightsHorizon({section}))
  }

  hasNextFlight = computed(() => this.numFlights() > (this.numFinishedFlights() ?? 0))

}
