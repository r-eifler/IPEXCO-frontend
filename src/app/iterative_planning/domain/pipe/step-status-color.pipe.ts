import { Pipe, PipeTransform } from '@angular/core';

import { PlanRunStatus } from '../plan';

@Pipe({
  name: 'stepStatusColor',
  standalone: true
})
export class StepStatusColorPipe implements PipeTransform {

  transform(value: PlanRunStatus | undefined) {
    if(value === undefined || value === null) {
      return 'neutral'
    }

    switch (value) {
      case PlanRunStatus.PENDING:
        return 'neutral';
      case PlanRunStatus.RUNNING:
        return 'neutral';
      case PlanRunStatus.FAILED:
        return 'error';
      case PlanRunStatus.CANCELED:
        return 'error';
      case PlanRunStatus.SOLVED:
        return 'secondary';
      case PlanRunStatus.NO_PLAN_FOUND:
        return 'error';
      case PlanRunStatus.UNSOLVABLE:
        return 'error';
    }
  }

}
