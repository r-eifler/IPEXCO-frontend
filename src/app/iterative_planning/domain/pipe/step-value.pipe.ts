import { Pipe, PipeTransform, Injectable } from '@angular/core';

import { IterationStep, StepStatus } from '../iteration_step';
import { PlanProperty } from '../../../shared/domain/plan-property/plan-property';
import { computeUtility } from '../plan';

@Injectable({ providedIn: 'root' })
@Pipe({
  name: 'stepValue',
  standalone: true
})
export class StepValuePipe implements PipeTransform {

  transform(step: IterationStep | null, planProperties: Record<string, PlanProperty> | null): number | undefined {
    if(!step || step.status != StepStatus.SOLVABLE || !step.plan || !planProperties) {
      return undefined;
    }

    return computeUtility(step.plan, planProperties);
  }

}
