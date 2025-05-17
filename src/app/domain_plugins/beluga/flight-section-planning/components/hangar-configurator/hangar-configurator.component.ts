import { Component, computed, inject, input, output } from '@angular/core';
import { HangarComponent } from '../../../shared/components/hangar/hangar.component';
import { MatButtonModule } from '@angular/material/button';
import { JigComponent } from '../../../shared/components/jig/jig.component';
import { Jig, JigType } from '../../../shared/domain/beluga_problem';
import { Trailer, SiteStatus } from '../../../shared/domain/site_set_up';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { selectAllowObjectiveModification, selectJigMapIncomingFlight } from '../../state/flight-section-planning.selector';

@Component({
  selector: 'app-hangar-configurator',
  imports: [
    HangarComponent,
    JigComponent,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './hangar-configurator.component.html',
  styleUrl: './hangar-configurator.component.scss'
})
export class HangarConfiguratorComponent {

  store = inject(Store);

  incomingFlightJigMap = this.store.selectSignal(selectJigMapIncomingFlight);

  hangar = input.required<Trailer & {jig: Jig}>();
  jigTypes = input.required<Record<string,JigType>>();
  disabled = input<boolean>(false);

  statusChanged = output<SiteStatus>();

  jig = computed(() => this.hangar()?.jig)
  isUsed = computed(() => this.hangar()?.status === SiteStatus.IN_USE)
  isLoaded = computed(() => this.jig() !== null)

  onLock(){
    this.statusChanged.emit(SiteStatus.MAINTENANCE)
  }

  onUnlock(){
    this.statusChanged.emit(SiteStatus.IN_USE);
  }

}
