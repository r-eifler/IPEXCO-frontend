import { Component, computed, effect, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoModule } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { createSuccessorFlightsHorizon } from '../../state/flight-section-planning.actions';
import { selectActiveBranchLastSectionFinished, selectActiveBranchNumberCoveredFlights, selectActiveBranchNumberFinishedFlights, selectActiveBranchSections, selectFlights, selectNumFlights } from '../../state/flight-section-planning.selector';
import { SectionCardComponent } from '../section-card/section-card.component';
import { take } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { NewFlightHorizonDialogComponent } from '../new-flight-horizon-dialog/new-flight-horizon-dialog.component';




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
  readonly dialog = inject(MatDialog);

  sections = this.store.selectSignal(selectActiveBranchSections);
  flights = this.store.selectSignal(selectFlights);
  lastSectionFinished = this.store.selectSignal(selectActiveBranchLastSectionFinished);

  numFlights = this.store.selectSignal(selectNumFlights);
  numCoveredFlights = this.store.selectSignal(selectActiveBranchNumberCoveredFlights);

  onNextFlightPlan(){
    const sections  = this.sections();
    if(sections == undefined){
      return;
    }
    const lastSection  = sections[sections.length - 1]
    const completedFlightsIndices = sections.map(s => s.flightIndices).flat();
    const neededFlights = this.flights()?.
      map((f,index) => ({originalIndex: index, ...f})).
      filter((f, index) => ! completedFlightsIndices.includes(index))

    const dialogRef = this.dialog.open(NewFlightHorizonDialogComponent, 
    {data: {
      neededFlights
    }});

    dialogRef.afterClosed().pipe(take(1)).subscribe((result: {horizon: number[]}) => {
      if (result !== undefined) {
        console.log(result);
        this.store.dispatch(createSuccessorFlightsHorizon({section: lastSection, horizon: result.horizon}));
      }
    });
  }

  hasNextFlight = computed(() => this.numFlights() > (this.numCoveredFlights() ?? 0))

}
