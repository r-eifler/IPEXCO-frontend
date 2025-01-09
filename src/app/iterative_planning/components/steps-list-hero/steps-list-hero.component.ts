import { Component, computed, inject, input, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { selectIterativePlanningIterationSteps, selectIterativePlanningProject, selectIterativePlanningProperties } from '../../state/iterative-planning.selector';
import { Demo, computeMaxPossibleUtility } from 'src/app/project/domain/demo';
import { IterationStep, StepStatus } from '../../domain/iteration_step';
import { computeUtility } from '../../domain/plan';
import { PlanProperty } from 'src/app/shared/domain/plan-property/plan-property';

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

  planPropertiesMap = input.required<Record<string,PlanProperty>>();
  steps = input.required<IterationStep[]>();

  maxOverallUtility = input.required<number>();
  currentMaxUtility = input.required<number>();

  numSolvedSteps = computed(() => this.steps()?.filter(s => s.status === StepStatus.solvable).length)
  umUnSolvedSteps = computed(() => this.steps()?.filter(s => s.status === StepStatus.unsolvable).length)
}
