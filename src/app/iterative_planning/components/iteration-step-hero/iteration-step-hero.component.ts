import { Component, computed, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { DefaultPipe } from 'src/app/shared/common/pipe/default.pipe';
import { LabelModule } from 'src/app/shared/components/label/label.module';
import { PlanProperty } from '../../../shared/domain/plan-property/plan-property';
import { DemoDirective } from '../../directives/isDemo.directive';
import { ProjectDirective } from '../../directives/isProject.directive';
import { IterationStep } from '../../domain/iteration_step';
import { StepStatusColorPipe } from '../../domain/pipe/step-status-color.pipe';
import { StepStatusNamePipe } from '../../domain/pipe/step-status-name.pipe';
import { StepValuePipe } from '../../domain/pipe/step-value.pipe';
import { TaskInformationDialogComponent } from '../../view/task-information-dialog/task-information-dialog.component';
import { PlanRunStatus } from '../../domain/plan';

import { CommonModule } from '@angular/common';
import { MonetaryRewardEvaluatorService } from '../../service/monetary-reward-evaluator';

@Component({
    selector: 'app-iteration-step-hero',
    imports: [
      MatCardModule,
      MatChipsModule,
      StepStatusNamePipe,
      MatIconModule,
      LabelModule,
      StepValuePipe,
      DefaultPipe,
      MatButtonModule,
      MatTooltipModule,
      StepStatusColorPipe,
      RouterLink,
      ProjectDirective,
      DemoDirective,
      CommonModule
    ],
    templateUrl: './iteration-step-hero.component.html',
    styleUrl: './iteration-step-hero.component.scss'
})
export class IterationStepHeroComponent {

  dialog = inject(MatDialog);
  rewardEvaluator = inject(MonetaryRewardEvaluatorService);
  stepValuePipe = inject(StepValuePipe);

  step = input.required<IterationStep | null>();
  planProperties = input.required<Record<string, PlanProperty> | null>();

  maxOverallUtility = input.required<number>();
  showPaymentInfo = input<boolean>(false);
  minPayment = input<number>();
  maxPayment = input<number>();
  step_payments = input<number[]>();

  solved = computed(() => this.step()?.plan?.status === PlanRunStatus.SOLVED)

  openTaskInfo(){
     this.dialog.open(TaskInformationDialogComponent);
  }

  currentUtility(): number | undefined {
    return this.stepValuePipe.transform(this.step(), this.planProperties());
  }

  computeCurrentUtilityProportion(): number {
    return this.rewardEvaluator.computeUtilityProportion(
      this.currentUtility(),
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
