import { Pipe, PipeTransform } from '@angular/core';

import { PlanRunStatus } from '../plan';

@Pipe({
  name: 'stepStatusName',
  standalone: true
})
export class StepStatusNamePipe implements PipeTransform {

  transform(value: PlanRunStatus | undefined): string {
    if(value === undefined || value === null) {
      return 'Unknown';
    }

    switch (value) {
      case PlanRunStatus.pending:
        return 'Pending';
      case PlanRunStatus.running:
        return 'Running';
      case PlanRunStatus.failed:
        return 'Failed';
      case PlanRunStatus.plan_found:
        return 'Solved';
      case PlanRunStatus.not_solvable:
        return 'Unsolvable';
      case PlanRunStatus.canceled:
        return 'Canceled';
    }
  }

}
