import { Component, computed, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { TranslocoModule } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { LabelModule } from 'src/app/shared/components/label/label.module';
import { computeRackOccupancyRate, computeSwaps } from '../../domain/metrics';
import { selectActiveBranchActions, selectActiveBranchNumberFinishedFlights, selectActiveBranchSections, selectInitialState, selectNumFlights, selectNumJigs, selectNumRacks, selectTask } from '../../state/flight-section-planning.selector';
import { MatIconModule } from '@angular/material/icon';
import { sum } from 'ramda';

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
  numFinishedFlights = this.store.selectSignal(selectActiveBranchNumberFinishedFlights);

  numFlights = this.store.selectSignal(selectNumFlights);
  numRacks = this.store.selectSignal(selectNumRacks);
  numJigs= this.store.selectSignal(selectNumJigs);

  length = computed(() => this.activeBranchActions()?.length);
  swaps = computed(() => computeSwaps(this.activeBranchActions() ?? []));

  rackOccupancyRate = computed(() => {
    const sections = this.sections();
    if(sections == undefined){
      return undefined;
    }
    const occRates: (number | undefined)[] = []
    this.sections()?.forEach(
      section => occRates.push(computeRackOccupancyRate(section, section.actions))
    )
    const sumRates = sum(occRates.filter(v => v !== undefined));
    const res = sumRates / sections.length
    return res.toFixed(2);
  });

}
