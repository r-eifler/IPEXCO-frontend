import { Component, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { JigComponent } from '../../../shared/components/jig/jig.component';
import { MatIconModule } from '@angular/material/icon';
import { GoalSolvabilityStatus } from '../../../flight-section-planning/domain/flight-section';
import { Store } from '@ngrx/store';
import { Jig, JigType } from '../../../shared/domain/beluga_problem';
import { selectJigMapIncomingFlight } from '../../state/builder.selector';

@Component({
  selector: 'app-jig-status-production-line',
  imports: [
    JigComponent,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './jig-status-production-line.component.html',
  styleUrl: './jig-status-production-line.component.scss'
})
export class JigStatusProductionLineComponent {

  solvabilityStatuses = GoalSolvabilityStatus

  store = inject(Store);

  incomingFlightJigMap = this.store.selectSignal(selectJigMapIncomingFlight);

  index = input<null | number>(null);
  jig = input.required<Jig>();
  jigType = input.required<JigType>();
  status = input.required<{
    skip: boolean,
    solvability: GoalSolvabilityStatus,
    delivered: boolean,
    next: boolean,
  }>();



}
