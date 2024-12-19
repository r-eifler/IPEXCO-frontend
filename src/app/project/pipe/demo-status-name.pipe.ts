import { Pipe, PipeTransform } from '@angular/core';
import { DemoRunStatus } from 'src/app/project/domain/demo';

@Pipe({
  name: 'demoStatusName',
  standalone: true
})
export class DemoStatusNamePipe implements PipeTransform {

  transform(value: DemoRunStatus | undefined): string {
    if(value === undefined || value === null) {
      return 'Unknown';
    }

    switch (value) {
      case DemoRunStatus.pending:
        return 'Pending';
      case DemoRunStatus.running:
        return 'Running';
      case DemoRunStatus.failed:
        return 'Failed';
      case DemoRunStatus.finished:
        return 'Finished';
    }
  }

}
