import { Pipe, PipeTransform } from '@angular/core';
import { DemoRunStatus } from 'src/app/shared/domain/demo';

@Pipe({
  name: 'demoStatusName',
  standalone: true
})
export class DemoStatusNamePipe implements PipeTransform {

  transform(value: DemoRunStatus | undefined) {
    if(value === undefined || value === null) {
      return 'Unknown';
    }

    switch (value) {
      case DemoRunStatus.PENDING:
        return 'Pending';
      case DemoRunStatus.RUNNING:
        return 'Running';
      case DemoRunStatus.FAILED:
        return 'Failed';
      case DemoRunStatus.FINISHED:
        return 'Finished';
    }
  }

}
