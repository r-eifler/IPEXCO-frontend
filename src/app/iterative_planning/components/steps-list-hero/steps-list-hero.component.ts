import { Component, computed, inject, input, Signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { IterationStep, StepStatus } from '../../domain/iteration_step';
import { PlanProperty } from 'src/app/shared/domain/plan-property/plan-property';
import { DemoDirective } from '../../directives/isDemo.directive';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { TaskInformationDialogComponent } from '../../view/task-information-dialog/task-information-dialog.component';

import { CommonModule } from '@angular/common';
import { MonetaryRewardEvaluatorService } from '../../service/monetary-reward-evaluator';

@Component({
  selector: 'app-steps-list-hero',
  imports: [
    MatCardModule,
    MatIconModule,
    DemoDirective,
    MatButtonModule,
    CommonModule
  ],
  templateUrl: './steps-list-hero.component.html',
  styleUrl: './steps-list-hero.component.scss'
})
export class StepsListHeroComponent {

  dialog = inject(MatDialog);
  rewardEvaluator = inject(MonetaryRewardEvaluatorService);

  planPropertiesMap = input.required<Record<string,PlanProperty>>();
  steps = input.required<IterationStep[]>();

  maxOverallUtility = input.required<number>();
  currentMaxUtility = input.required<number>();
  minPayment = input<number>();
  maxPayment = input<number>();

  // Put payment markers at these utility proportions
  //
  // HACK: hard-coded for now
  markerPayments = [0.0, 0.5, 0.75, 1.0];

  numSolvedSteps = computed(() => this.steps()?.filter(s => s.status === StepStatus.SOLVABLE).length)
  umUnSolvedSteps = computed(() => this.steps()?.filter(s => s.status === StepStatus.UNSOLVABLE).length)

  openTaskInfo(){
   this.dialog.open(TaskInformationDialogComponent);
  }

  computePayment(utility_proportion: number){
    return this.rewardEvaluator.computePayment(
      utility_proportion,
      this.minPayment(),
      this.maxPayment()
    );
  }

  computeCurrentUtilityProportion(): number {
    return this.rewardEvaluator.computeUtilityProportion(
      this.currentMaxUtility(),
      this.maxOverallUtility()
    );
  }

  computeCurrentPayment(): number {
    return this.rewardEvaluator.computePayment(
      this.computeCurrentUtilityProportion(),
      this.minPayment(),
      this.maxPayment()
    );
  }

}
