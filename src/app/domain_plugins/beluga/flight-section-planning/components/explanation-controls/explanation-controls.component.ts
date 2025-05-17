import { Component, computed, effect, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { sum } from 'ramda';
import { ExplanationRunStatus } from 'src/app/iterative_planning/domain/explanation/explanations';
import { BelugaConfiguration, FlightSection } from '../../domain/flight-section';
import { startExplanations, updateConfiguration } from '../../state/flight-section-planning.actions';
import { selectAllowObjectiveModification } from '../../state/flight-section-planning.selector';
import { SwapConfiguratorComponent } from '../swap-configurator/swap-configurator.component';
import { TranslocoModule } from '@jsverse/transloco';
import { PlanRunStatus } from 'src/app/iterative_planning/domain/plan';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-explanation-controls',
  imports: [
    SwapConfiguratorComponent,
    MatSlideToggleModule,
    MatButtonModule,
    MatIcon,
    RouterLink,
    TranslocoModule,
    MatProgressBarModule,
  ],
  templateUrl: './explanation-controls.component.html',
  styleUrl: './explanation-controls.component.scss'
})
export class ExplanationControlsComponent {

  store = inject(Store);

  section = input.required<FlightSection>();
  config = input.required<BelugaConfiguration>();
  disabled = input<boolean>(false);

  rackEmptyConflict = input<boolean>(false);
  swapConflictMembers = input<{
    numSwaps: number,
  }[]>([]);
  
  numEmptyRacks = computed(() => sum(this.config()?.siteSetUp.racks.map(r => this.section()?.siteState.racks[r.name].length == 0 ? 1 : 0)))

  changeSwaps= output<number>();
  changeEmptyRacks= output<number>();

  hasExplanation = computed(() => this.config()?.explanationStatus == ExplanationRunStatus.FINISHED)
  explanationRunning = computed(() => this.config()?.explanationStatus == ExplanationRunStatus.RUNNING)
  maxSwaps = computed(() => this.config()?.maxSwaps)

  pending = computed(() => this.section()?.status == PlanRunStatus.PENDING)

  keepRackEmpty = computed(() => (this.config()?.minEmptyRacks ?? 0) >= 1)

  constructor(){
    effect(() => console.log(this.rackEmptyConflict()));
  }

  onExplain(){
    this.store.dispatch(startExplanations({section: this.section()}))
  }

  onUpdateConfiguration(){
    this.store.dispatch(updateConfiguration())
  }

}
