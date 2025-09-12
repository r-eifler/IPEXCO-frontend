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
import { MonetaryRewardEvaluator } from '../../service/monetary-reward-evaluator';

@Component({
  selector: 'app-steps-utility-hero',
  imports: [
    MatCardModule,
    MatIconModule,
    DemoDirective,
    MatButtonModule,
    CommonModule
  ],
  templateUrl: './steps-utility-hero.component.html',
  styleUrl: './steps-utility-hero.component.scss'
})
export class StepsUtilityHeroComponent {

  dialog = inject(MatDialog);

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
    return MonetaryRewardEvaluator.computePayment(
      utility_proportion,
      this.minPayment(),
      this.maxPayment()
    );
  }

  computeCurrentUtilityProportion(): number {
    return MonetaryRewardEvaluator.computeUtilityProportion(
      this.currentMaxUtility(),
      this.maxOverallUtility()
    );
  }

  computeCurrentPayment(): number {
    return MonetaryRewardEvaluator.computePayment(
      this.computeCurrentUtilityProportion(),
      this.minPayment(),
      this.maxPayment()
    );
  }

  computeUtilityFromProportion(utilityProportion: number): number {
    return MonetaryRewardEvaluator.computeUtilityFromProportion(
      utilityProportion,
      this.maxOverallUtility()
    );
  }

}
