import { Component, computed, effect, inject, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { sum } from 'ramda';
import { FlightsHorizon } from '../../domain/flight-section';

@Component({
  selector: 'app-constraints-conflict-indicator',
  imports: [
    MatIconModule,
  ],
  templateUrl: './constraints-conflict-indicator.component.html',
  styleUrl: './constraints-conflict-indicator.component.scss'
})
export class ConstraintsConflictIndicatorComponent {

    store = inject(Store);
  
    section = input.required<FlightsHorizon>();
    configIndex = input.required<number>();
    config = computed(() => this.section()?.configurations[this.configIndex()])
  
    rackEmptyConflict = input<boolean>(false);
    swapConflictMembers = input<{
      numSwaps: number,
    }[]>([]);
    
    numEmptyRacks = computed(() => sum(this.config()?.siteSetUp.racks.map(r => this.section()?.siteState.racks[r.name].length == 0 ? 1 : 0)))
  
    changeSwaps= output<number>();
    changeEmptyRacks= output<number>();

    hasMaxSwapsLimit = computed(() => this.config()?.maxSwaps !== null);
  
    maxSwaps = computed(() => this.config()?.maxSwaps)
   
    keepRackEmpty = computed(() => (this.config()?.minEmptyRacks ?? 0) >= 1)

}
