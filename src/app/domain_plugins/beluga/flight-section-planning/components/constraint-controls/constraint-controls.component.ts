import { Component, computed, inject, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { sum } from 'ramda';
import { ExplanationRunStatus } from 'src/app/iterative_planning/domain/explanation/explanations';
import { PlanRunStatus } from 'src/app/iterative_planning/domain/plan';
import { FlightsHorizon } from '../../domain/flight-section';

@Component({
  selector: 'app-constraint-controls',
  imports: [
    MatIconModule,
  ],
  templateUrl: './constraint-controls.component.html',
  styleUrl: './constraint-controls.component.scss'
})
export class ConstraintControlsComponent {

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
  
    maxSwaps = computed(() => this.config()?.maxSwaps)
   
    keepRackEmpty = computed(() => (this.config()?.minEmptyRacks ?? 0) >= 1)

}
