import { Component, computed, effect, inject, input, output } from '@angular/core';
import { SwapConfiguratorComponent } from '../swap-configurator/swap-configurator.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FlightSection } from '../../domain/flight-section';
import { sum } from 'ramda';
import { Store } from '@ngrx/store';
import { selectAllowObjectiveModification } from '../../state/flight-section-planning.selector';

@Component({
  selector: 'app-objective-configurator',
  imports: [
    SwapConfiguratorComponent,
    MatSlideToggleModule,
  ],
  templateUrl: './objective-configurator.component.html',
  styleUrl: './objective-configurator.component.scss'
})
export class ObjectiveConfiguratorComponent {

  store = inject(Store);
  allowModifications = this.store.selectSignal(selectAllowObjectiveModification);

  section = input.required<FlightSection>();
  numEmptyRacks = computed(() => sum(this.section()?.siteSetUp.racks.map(r => this.section()?.siteState.racks[r.name].length == 0 ? 1 : 0)))

  changeObjective = output<FlightSection>();


  maxSwaps = computed(() => this.section()?.maxSwaps)

  keepRackEmpty = computed(() => (this.section()?.minEmptyRacks ?? 0) >= 1)

  onSwapChange(v: number){
    console.log("Change Swaps")
    const newSection = {
      ...this.section(),
      maxSwaps: v,
    }
    console.log(newSection)
    this.changeObjective.emit(newSection);
  }

  onToggleRack(){
    console.log("Change use one rack")
    const newSection = {
      ...this.section(),
      minEmptyRacks: this.keepRackEmpty() ? 0 : 1,
    }
    this.changeObjective.emit(newSection);
  }

}
