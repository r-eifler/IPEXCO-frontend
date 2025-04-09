import { Pipe, PipeTransform } from '@angular/core';

import { PlanRunStatus } from '../plan';

@Pipe({
  name: 'stepStatusName',
  standalone: true
})
export class StepStatusNamePipe implements PipeTransform {

  transform(value: PlanRunStatus | undefined){
    if(value === undefined || value === null) {
      return 'Unknown';
    }

    switch (value) {
      case PlanRunStatus.PENDING:
        return 'Pending';
      case PlanRunStatus.RUNNING:
        return 'Running';
      case PlanRunStatus.FAILED:
        return 'Failed';
      case PlanRunStatus.SOLVED:
        return 'Solved';
      case PlanRunStatus.UNSOLVABLE:
        return 'Unsolvable';
      case PlanRunStatus.CANCELED:
        return 'Canceled';
    }
  }

}
