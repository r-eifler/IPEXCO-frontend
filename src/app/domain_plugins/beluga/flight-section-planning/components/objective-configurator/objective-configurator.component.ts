import { Component, computed, effect, inject, input, output } from '@angular/core';
import { SwapConfiguratorComponent } from '../swap-configurator/swap-configurator.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FlightSection } from '../../domain/flight-section';
import { sum } from 'ramda';
import { Store } from '@ngrx/store';
import { selectAllowObjectiveModification } from '../../state/flight-section-planning.selector';
import { saveConfiguration, updateEmptyRacks, updateMaxSwaps } from '../../state/flight-section-planning.actions';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-objective-configurator',
  imports: [
    SwapConfiguratorComponent,
    MatSlideToggleModule,
    MatButtonModule,
    MatIcon,
    RouterLink
  ],
  templateUrl: './objective-configurator.component.html',
  styleUrl: './objective-configurator.component.scss'
})
export class ObjectiveConfiguratorComponent {

  store = inject(Store);
  allowModifications = this.store.selectSignal(selectAllowObjectiveModification);

  section = input.required<FlightSection>();
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

  onSave(){
    this.store.dispatch(saveConfiguration());
  }
}
