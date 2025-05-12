import { Component, computed, effect, input, output } from '@angular/core';
import { RackComponent } from '../../../shared/components/rack/rack.component';
import { JigComponent } from '../../../shared/components/jig/jig.component';
import { Rack, SiteStatus } from '../../../shared/domain/site_set_up';
import { Jig, JigType, occupiedSpace } from '../../../shared/domain/beluga_problem';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-rack-configurator',
  imports: [
    RackComponent,
    JigComponent,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './rack-configurator.component.html',
  styleUrl: './rack-configurator.component.scss'
})
export class RackConfiguratorComponent {


  rack = input.required<Rack & {jigs: Jig[]}>();
  jigTypes = input.required<Record<string,JigType>>();

  statusChanged = output<SiteStatus>();

  occupied = computed(() => occupiedSpace(this.rack()?.jigs, this.jigTypes()))
  isUsed = computed(() => this.rack()?.status === SiteStatus.IN_USE)

  onLock(){
    this.statusChanged.emit(SiteStatus.MAINTENANCE)
  }

  onUnlock(){
    this.statusChanged.emit(SiteStatus.IN_USE);
  }
}
