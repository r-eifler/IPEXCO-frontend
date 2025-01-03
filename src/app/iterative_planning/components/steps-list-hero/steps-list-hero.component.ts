import { Component, computed, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { selectIterativePlanningIterationSteps, selectIterativePlanningProject, selectIterativePlanningProperties } from '../../state/iterative-planning.selector';
import { Demo, maxUtility } from 'src/app/project/domain/demo';
import { StepStatus } from '../../domain/iteration_step';
import { computeUtility } from '../../domain/plan';

@Component({
  selector: 'app-steps-list-hero',
  imports: [
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './steps-list-hero.component.html',
  styleUrl: './steps-list-hero.component.scss'
})
export class StepsListHeroComponent {

  store = inject(Store);

  demo = toSignal(this.store.select(selectIterativePlanningProject)) as Signal<Demo>;
  planPropertiesMap = toSignal(this.store.select(selectIterativePlanningProperties));
  steps = toSignal(this.store.select(selectIterativePlanningIterationSteps));


  maxOverallUtility = computed(() => maxUtility(this.demo(), this.planPropertiesMap() ? Object.values(this.planPropertiesMap()) : null))

  currentMaxUtility = computed(() => {
    if(!this.steps() || this.steps().length === 0){
      return 0;
    } 
    const stepUtilities = this.steps()?.map(s => s.status !== StepStatus.solvable ? 0 : computeUtility(s.plan, this.planPropertiesMap()));
    return Math.max(...stepUtilities);
  })

  numSolvedSteps = computed(() => this.steps()?.filter(s => s.status === StepStatus.solvable).length)
  umUnSolvedSteps = computed(() => this.steps()?.filter(s => s.status === StepStatus.unsolvable).length)
}
