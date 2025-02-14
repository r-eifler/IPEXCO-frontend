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
      case DemoRunStatus.pending:
        return 'neutral';
      case DemoRunStatus.running:
        return 'neutral';
      case DemoRunStatus.failed:
        return 'error';
      case DemoRunStatus.finished:
        return 'secondary';
    }

    return 'neutral'
  }
;
}
