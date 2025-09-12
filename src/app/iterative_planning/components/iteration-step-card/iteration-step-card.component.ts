import { Component, computed, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';

import { DefaultPipe } from 'src/app/shared/common/pipe/default.pipe';
import { LabelModule } from 'src/app/shared/components/label/label.module';
import { IterationStep, StepStatus } from '../../domain/iteration_step';
import { StepStatusColorPipe } from '../../domain/pipe/step-status-color.pipe';
import { StepStatusNamePipe } from '../../domain/pipe/step-status-name.pipe';
import { StepValuePipe } from '../../domain/pipe/step-value.pipe';
import { PlanProperty } from '../../../shared/domain/plan-property/plan-property';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { PlanRunStatus } from '../../domain/plan';
import { ProjectDirective } from '../../directives/isProject.directive';
import { DemoDirective } from '../../directives/isDemo.directive';
import { Store } from '@ngrx/store';
import { selectIterativePlanningLoadingFinished } from '../../state/iterative-planning.selector';

import { CommonModule } from '@angular/common';
import { MonetaryRewardEvaluator } from '../../service/monetary-reward-evaluator';

@Component({
    selector: 'app-iteration-step-card',
    imports: [
      MatCardModule,
      MatChipsModule,
      StepStatusNamePipe,
      MatIconModule,
      LabelModule,
      StepValuePipe,
      DefaultPipe,
      MatButtonModule,
      RouterLink,
      MatTooltipModule,
      StepStatusColorPipe,
      MatProgressBarModule,
      ProjectDirective,
      DemoDirective,
      CommonModule
    ],
    templateUrl: './iteration-step-card.component.html',
    styleUrl: './iteration-step-card.component.scss'
})
export class IterationStepCardComponent {

  store = inject(Store);
  stepValuePipe = inject(StepValuePipe);

  step = input.required<IterationStep | null>();
  planProperties = input.required<Record<string, PlanProperty> | null>();

  anabelCreationInterface = this.store.select(selectIterativePlanningLoadingFinished);

  planComputationRunning = computed(() =>
    ! this.step()?.plan ||
    this.step()?.plan?.status == PlanRunStatus.PENDING ||
    this.step()?.plan?.status == PlanRunStatus.RUNNING
  )

  maxOverallUtility = input.required<number>();
  minPayment = input<number>();
  maxPayment = input<number>();

  fork = output<void>();
  cancel = output<void>();

  onFork(): void {
    this.fork.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }

  currentUtility(): number | undefined {
    return this.stepValuePipe.transform(this.step(), this.planProperties());
  }

  computeCurrentUtilityProportion(): number {
    return MonetaryRewardEvaluator.computeUtilityProportion(
      this.currentUtility(),
      this.maxOverallUtility()
    );
  }

  computeCurrentPayment(): number {
    return MonetaryRewardEvaluator.computePayment(
      this.computeCurrentUtilityProportion(),
      (this.minPayment() ?? 0),
      (this.maxPayment() ?? 0)
    );
  }

}
