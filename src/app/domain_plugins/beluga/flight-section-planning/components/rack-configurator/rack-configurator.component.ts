import { Component, computed, effect, inject, input, output } from '@angular/core';
import { RackComponent } from '../../../shared/components/rack/rack.component';
import { JigComponent } from '../../../shared/components/jig/jig.component';
import { Rack, SiteStatus } from '../../../shared/domain/site_set_up';
import { Jig, JigType, occupiedSpace } from '../../../shared/domain/beluga_problem';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TooltipModule } from '@swimlane/ngx-charts';
import { Store } from '@ngrx/store';
import { selectJigMapIncomingFlight } from '../../state/flight-section-planning.selector';

@Component({
  selector: 'app-rack-configurator',
  imports: [
    RackComponent,
    JigComponent,
    MatButtonModule,
    MatIconModule,
    TooltipModule,
  ],
  templateUrl: './rack-configurator.component.html',
  styleUrl: './rack-configurator.component.scss'
})
export class RackConfiguratorComponent {

  store = inject(Store);

  incomingFlightJigMap = this.store.selectSignal(selectJigMapIncomingFlight);

  rack = input.required<Rack & {jigs: Jig[]}>();
  jigTypes = input.required<Record<string,JigType>>();

  statusChanged = output<SiteStatus>();

  occupied = computed(() => occupiedSpace(this.rack()?.jigs, this.jigTypes()))
  isLoaded = computed(() => this.rack()?.jigs.length > 0)
  isUsed = computed(() => this.rack()?.status === SiteStatus.IN_USE)

  onLock(){
    this.statusChanged.emit(SiteStatus.MAINTENANCE)
  }

  onUnlock(){
    this.statusChanged.emit(SiteStatus.IN_USE);
  }
}
