import { Component, effect, inject, input, output } from '@angular/core';
import { Jig, JigType } from '../../../shared/domain/beluga_problem';
import { GoalSolvabilityStatus } from '../../domain/flight-section';
import { JigComponent } from '../../../shared/components/jig/jig.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { selectJigMapIncomingFlight } from '../../state/flight-section-planning.selector';

@Component({
  selector: 'app-jig-configurator',
  imports: [
    JigComponent,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './jig-configurator.component.html',
  styleUrl: './jig-configurator.component.scss'
})
export class JigConfiguratorComponent {

  solvabilityStatuses = GoalSolvabilityStatus

  store = inject(Store);

  incomingFlightJigMap = this.store.selectSignal(selectJigMapIncomingFlight);

  index = input<null | number>(null);
  jig = input.required<Jig>();
  jigType = input.required<JigType>();
  status = input.required<{
    skip: boolean,
    solvabilityStatus: GoalSolvabilityStatus
  }>();

  showOnlyPart = input<boolean>(false);

  statusChange = output<boolean>();

  onStatusChanged(skip: boolean){
    this.statusChange.emit(skip)
  }
}
