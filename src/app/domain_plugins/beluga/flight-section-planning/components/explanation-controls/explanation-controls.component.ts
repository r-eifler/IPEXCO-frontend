import { Component, computed, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { sum } from 'ramda';
import { ExplanationRunStatus } from 'src/app/iterative_planning/domain/explanation/explanations';
import { FlightSection } from '../../domain/flight-section';
import { startExplanations } from '../../state/flight-section-planning.actions';
import { selectAllowObjectiveModification } from '../../state/flight-section-planning.selector';
import { SwapConfiguratorComponent } from '../swap-configurator/swap-configurator.component';

@Component({
  selector: 'app-explanation-controls',
  imports: [
    SwapConfiguratorComponent,
    MatSlideToggleModule,
    MatButtonModule,
    MatIcon,
    RouterLink
  ],
  templateUrl: './explanation-controls.component.html',
  styleUrl: './explanation-controls.component.scss'
})
export class ExplanationControlsComponent {

  store = inject(Store);
  allowModifications = this.store.selectSignal(selectAllowObjectiveModification);

  section = input.required<FlightSection>();
  config = computed(() => this.section()?.configurations[this.section().configurationIndex]);
  numEmptyRacks = computed(() => sum(this.config()?.siteSetUp.racks.map(r => this.section()?.siteState.racks[r.name].length == 0 ? 1 : 0)))

  changeSwaps= output<number>();
  changeEmptyRacks= output<number>();

  hasExplanation = computed(() => this.config()?.explanationStatus == ExplanationRunStatus.FINISHED)
  maxSwaps = computed(() => this.config()?.maxSwaps)

  keepRackEmpty = computed(() => (this.config()?.minEmptyRacks ?? 0) >= 1)

  onExplain(){
    this.store.dispatch(startExplanations({section: this.section()}))
  }

}
