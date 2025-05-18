import { Component, computed, effect, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterLink } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { sum } from 'ramda';
import { ExplanationRunStatus } from 'src/app/iterative_planning/domain/explanation/explanations';
import { PlanRunStatus } from 'src/app/iterative_planning/domain/plan';
import { BelugaConfiguration, FlightSection } from '../../domain/flight-section';
import { newConfiguration, startExplanations } from '../../state/flight-section-planning.actions';
import { SwapConfiguratorComponent } from '../swap-configurator/swap-configurator.component';

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
  configIndex = input.required<number>();
  config = computed(() => this.section()?.[this.configIndex()])
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
    this.store.dispatch(startExplanations({section: this.section(), configIndex: this.configIndex()}))
  }

  onUpdateConfiguration(){
    this.store.dispatch(newConfiguration())
  }

}
