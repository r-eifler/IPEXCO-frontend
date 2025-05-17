import { Component, computed, effect, inject, input, output } from '@angular/core';
import { Jig, JigType } from '../../../shared/domain/beluga_problem';
import { JigComponent } from '../../../shared/components/jig/jig.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { selectAllowObjectiveModification, selectJigMapIncomingFlight } from '../../state/flight-section-planning.selector';

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

  store = inject(Store);

  incomingFlightJigMap = this.store.selectSignal(selectJigMapIncomingFlight);

  index = input<null | number>(null);
  jig = input.required<Jig>();
  jigType = input.required<JigType>();
  status = input.required<{
    skip: boolean,
    onSite: boolean,
    inConflict: boolean
  }>();
  disabled = input<boolean>(false);

  showOnlyPart = input<boolean>(false);

  mustBeSkipped = computed(() => !this.status()?.onSite)
  inConflict = computed(() => this.status()?.inConflict)

  statusChange = output<boolean>();

  onStatusChanged(skip: boolean){
    this.statusChange.emit(skip)
  }
}
