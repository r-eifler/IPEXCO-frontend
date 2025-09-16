import { Component, computed, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Store } from '@ngrx/store';
import { sum } from 'ramda';
import { FlightsHorizon } from '../../domain/flight-section';
import { updateEmptyRacks, updateMaxSwaps } from '../../state/flight-section-planning.actions';
import { selectAllowObjectiveModification } from '../../state/flight-section-planning.selector';
import { SwapConfiguratorComponent } from '../swap-configurator/swap-configurator.component';

@Component({
  selector: 'app-constraint-controls',
  imports: [
    SwapConfiguratorComponent,
    MatSlideToggleModule,
    MatButtonModule,
  ],
  templateUrl: './constraint-controls.component.html',
  styleUrl: './constraint-controls.component.scss'
})
export class ConstraintControlsComponent {

    store = inject(Store);
    allowModifications = this.store.selectSignal(selectAllowObjectiveModification);
  
    section = input.required<FlightsHorizon>();
    config = computed(() => this.section()?.configurations[this.section().configurationIndex]);
    numEmptyRacks = computed(() => sum(this.config()?.siteSetUp.racks.map(r => this.section()?.siteState.racks[r.name].length == 0 ? 1 : 0)))
  
    changeSwaps= output<number>();
    changeEmptyRacks= output<number>();
  
  
    maxSwaps = computed(() => this.config()?.maxSwaps)
  
    keepRackEmpty = computed(() => (this.config()?.minEmptyRacks ?? 0) >= 1)
  
    onSwapChange(value: number){
      this.store.dispatch(updateMaxSwaps({value}));
    }
  
    onToggleRack(){
      this.store.dispatch(updateEmptyRacks({value: this.keepRackEmpty() ? 0 : 1}));
    }

}
