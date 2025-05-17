import { Component, computed, inject, input, output } from '@angular/core';
import { SiteStatus, Trailer } from '../../../shared/domain/site_set_up';
import { TrailerComponent } from '../../../shared/components/trailer/trailer.component';
import { JigComponent } from '../../../shared/components/jig/jig.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Jig, JigType } from '../../../shared/domain/beluga_problem';
import { Store } from '@ngrx/store';
import { selectAllowObjectiveModification, selectJigMapIncomingFlight } from '../../state/flight-section-planning.selector';

@Component({
  selector: 'app-trailer-configurator',
  imports: [
    TrailerComponent,
    JigComponent,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './trailer-configurator.component.html',
  styleUrl: './trailer-configurator.component.scss'
})
export class TrailerConfiguratorComponent {

    store = inject(Store);
  
    incomingFlightJigMap = this.store.selectSignal(selectJigMapIncomingFlight);

    trailer = input.required<Trailer & {jig: Jig}>();
    jigTypes = input.required<Record<string,JigType>>();
    disabled = input<boolean>(false);

    conflictMembers = input<{
          trailerName: string
        }[]>([]);
    
    inConflict = computed(() => this.conflictMembers()?.find(e => e.trailerName == this.trailer().name) !== undefined)
  
    statusChanged = output<SiteStatus>();
  
    jig = computed(() => this.trailer()?.jig)
    isUsed = computed(() => this.trailer()?.status === SiteStatus.IN_USE)
    isLoaded = computed(() => this.jig() !== null)
  
    onLock(){
      this.statusChanged.emit(SiteStatus.MAINTENANCE)
    }
  
    onUnlock(){
      this.statusChanged.emit(SiteStatus.IN_USE);
    }

}
