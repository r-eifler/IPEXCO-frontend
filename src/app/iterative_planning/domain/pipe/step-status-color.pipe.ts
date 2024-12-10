import { Pipe, PipeTransform } from '@angular/core';

import { Color } from 'src/app/shared/components/label/label/label.component';

import { PlanRunStatus } from '../plan';

@Pipe({
  name: 'stepStatusColor',
  standalone: true
})
export class StepStatusColorPipe implements PipeTransform {

  transform(value: PlanRunStatus | undefined): Color {
    if(value === undefined || value === null) {
      return 'neutral'
    }

    switch (value) {
      case PlanRunStatus.pending:
        return 'neutral';
      case PlanRunStatus.running:
        return 'neutral';
      case PlanRunStatus.failed:
        return 'error';
      case PlanRunStatus.plan_found:
        return 'secondary';
      case PlanRunStatus.not_solvable:
        return 'error';
    }
  }

}
