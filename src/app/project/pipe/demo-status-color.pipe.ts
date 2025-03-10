import { Pipe, PipeTransform } from '@angular/core';

import { Color } from 'src/app/shared/components/label/label/label.component';
import { DemoRunStatus } from 'src/app/shared/domain/demo';


@Pipe({
  name: 'demoStatusColor',
  standalone: true
})
export class DemoStatusColorPipe implements PipeTransform {

  transform(value: DemoRunStatus | undefined): Color {
    if(value === undefined || value === null) {
      return 'neutral'
    }

    switch (value) {
      case DemoRunStatus.PENDING:
        return 'neutral';
      case DemoRunStatus.RUNNING:
        return 'neutral';
      case DemoRunStatus.FAILED:
        return 'error';
      case DemoRunStatus.FINISHED:
        return 'secondary';
    }

    return 'neutral'
  }
;
}
