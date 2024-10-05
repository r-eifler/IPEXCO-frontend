import { Pipe, PipeTransform } from '@angular/core';

import { StepStatus } from '../iteration_step';

@Pipe({
  name: 'stepStatusName',
  standalone: true
})
export class StepStatusNamePipe implements PipeTransform {

  transform(value: StepStatus): string {
    switch (value) {
      case StepStatus.unknown:
        return 'Unknown';
      case StepStatus.solvable:
        return 'Solvable';
      case StepStatus.unsolvable:
        return 'Unsolvable';
    }
  }

}
