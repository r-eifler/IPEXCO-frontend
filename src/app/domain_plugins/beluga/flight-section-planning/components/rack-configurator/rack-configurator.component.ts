import { Component, computed, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { JigComponent } from '../../../shared/components/jig/jig.component';
import { RackComponent } from '../../../shared/components/rack/rack.component';
import { Jig, JigType, occupiedSpace } from '../../../shared/domain/beluga_problem';
import { Rack, SiteStatus } from '../../../shared/domain/site_set_up';
import { selectJigMapIncomingFlight } from '../../state/flight-section-planning.selector';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-rack-configurator',
  imports: [
    RackComponent,
    JigComponent,
    MatButtonModule,
    MatIconModule,
    TranslocoModule,
    MatTooltipModule,
  ],
  templateUrl: './rack-configurator.component.html',
  styleUrl: './rack-configurator.component.scss'
})
export class RackConfiguratorComponent {

  store = inject(Store);

  incomingFlightJigMap = this.store.selectSignal(selectJigMapIncomingFlight);

  rack = input.required<Rack & {jigs: Jig[]}>();
  jigTypes = input.required<Record<string,JigType>>();
  disabled = input<boolean>(false);
  conflictMembers = input<{
      rackName: string
    }[]>([]);

  inConflict = computed(() => this.conflictMembers()?.find(e => e.rackName == this.rack().name) !== undefined)

  statusChanged = output<SiteStatus>();

  occupied = computed(() => occupiedSpace(this.rack()?.jigs, this.jigTypes()))
  isLoaded = computed(() => this.rack()?.jigs?.length > 0)
  isUsed = computed(() => this.rack()?.status === SiteStatus.IN_USE)

  onLock(){
    this.statusChanged.emit(SiteStatus.MAINTENANCE)
  }

  onUnlock(){
    this.statusChanged.emit(SiteStatus.IN_USE);
  }
}
