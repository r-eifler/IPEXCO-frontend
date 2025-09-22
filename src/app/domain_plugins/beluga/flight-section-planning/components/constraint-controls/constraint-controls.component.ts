import { Component, computed, inject, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Store } from '@ngrx/store';
import { updateEmptyRacks, updateMaxSwaps } from '../../state/flight-section-planning.actions';
import { selectAllowObjectiveModification, selectNumEmptyRacks, selectUpdatingConfiguration, selectUpdatingEmptyRacks, selectUpdatingMaxNumSwaps } from '../../state/flight-section-planning.selector';
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
  
    numEmptyRacks = this.store.selectSignal(selectNumEmptyRacks);
    canKeepRackEmpty = computed(() => this.numEmptyRacks() > 0)

    constraintMaxSwaps = this.store.selectSignal(selectUpdatingMaxNumSwaps);
    constraintKeepNUmRacksEmpty = this.store.selectSignal(selectUpdatingEmptyRacks);
    keepOneRackEmpty = computed(() => (this.constraintKeepNUmRacksEmpty() ?? 0) > 0)
  
    onSwapChange(value: number | null){
      this.store.dispatch(updateMaxSwaps({value}));
    }
  
    onToggleRack(event: MatSlideToggleChange){
      this.store.dispatch(updateEmptyRacks({value: event.checked ? 0 : 1}));
    }

}
