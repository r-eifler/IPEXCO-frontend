import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Store } from '@ngrx/store';
import { selectActiveBranchLastSectionFinished, selectActiveBranchSections, selectFlights } from '../../state/flight-section-planning.selector';
import { SectionCardComponent } from '../section-card/section-card.component';
import { TranslocoModule } from '@jsverse/transloco';



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

  onNextFlightPlan(){

  }
}
