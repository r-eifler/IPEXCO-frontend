import { Pipe, PipeTransform } from '@angular/core';

import { IterationStep, StepStatus } from '../iteration_step';
import { PlanProperty } from '../../../shared/domain/plan-property/plan-property';
import { computeUtility } from '../plan';

@Pipe({
  name: 'stepValue',
  standalone: true
})
export class StepValuePipe implements PipeTransform {

  transform(step: IterationStep | null, planProperties: Record<string, PlanProperty> | null): number | undefined {
    if(!step || step.status != StepStatus.solvable || !step.plan || !planProperties) {
      return undefined;
    }

    return computeUtility(step.plan, planProperties);
  }

}
