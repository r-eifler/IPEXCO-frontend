import { Pipe, PipeTransform } from '@angular/core';
import { DemoRunStatus } from 'src/app/project/domain/demo';

import { Color } from 'src/app/shared/components/label/label/label.component';


@Pipe({
  name: 'userStudyStatusColor',
  standalone: true
})
export class UserStudyStatusColorPipe implements PipeTransform {

  transform(value: {start: Date, end: Date} | undefined): Color {
    if(value === undefined || value === null) {
      return 'neutral'
    }

    const now = new Date();
    if(now >= value.start && now <= value.end) {
      return 'secondary'
    }
    return 'neutral';
  }

}
