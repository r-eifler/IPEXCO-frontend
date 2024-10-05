import { Pipe, PipeTransform } from '@angular/core';

import { IterationStep } from '../iteration_step';
import { PlanProperty } from '../plan-property/plan-property';
import { computeStepUtility } from '../run';

@Pipe({
  name: 'stepValue',
  standalone: true
})
export class StepValuePipe implements PipeTransform {

  transform(step: IterationStep | null, planProperties: Record<string, PlanProperty> | null): number | undefined {
    if(!step || !planProperties) {
      return undefined;
    }

    return computeStepUtility(step, planProperties);
  }

}
