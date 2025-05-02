import { Component, computed, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { TranslocoModule } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { LabelModule } from 'src/app/shared/components/label/label.module';
import { computeRackOccupancyRate, computeSwaps } from '../../domain/metrics';
import { selectActiveBranchActions, selectActiveBranchFinishedFlights, selectActiveBranchSections, selectInitialState, selectNumFlightsFlights, selectTask } from '../../state/flight-section-planning.selector';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-section-tree-hero',
  imports: [
    MatCardModule, 
    MatChipsModule, 
    MatIconModule, 
    LabelModule, 
    TranslocoModule,
  ],
  templateUrl: './section-tree-hero.component.html',
  styleUrl: './section-tree-hero.component.scss'
})
export class SectionTreeHeroComponent {

  store = inject(Store);

  task = this.store.selectSignal(selectTask);
  initialState = this.store.selectSignal(selectInitialState);

  sections = this.store.selectSignal(selectActiveBranchSections);
  activeBranchActions =  this.store.selectSignal(selectActiveBranchActions);
  numFinishedFlights = this.store.selectSignal(selectActiveBranchFinishedFlights);

  numFlights = this.store.selectSignal(selectNumFlightsFlights);
  numRacks = computed(() => this.task()?.racks.length)
  numJigs= computed(() => {
    let jigs = this.task()?.jigs
    return jigs != undefined ? Object.keys(jigs).length : null
  })

  length = computed(() => this.activeBranchActions()?.length);
  swaps = computed(() => computeSwaps(this.activeBranchActions() ?? []));

  rackOccupancyRate = computed(() => {

    const task = this.task();
    const startState  = this.initialState();
    if(task === undefined || startState === undefined){
      return undefined;
    }
    return computeRackOccupancyRate(task, startState, this.activeBranchActions() ?? []);
  });

}
