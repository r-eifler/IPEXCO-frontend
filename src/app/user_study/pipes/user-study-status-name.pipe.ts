import { Pipe, PipeTransform } from '@angular/core';
import { DemoRunStatus } from 'src/app/demo/domain/demo';
import {Color} from '../../shared/components/label/label/label.component';

@Pipe({
  name: 'userStudyStatusName',
  standalone: true
})
export class UserStudyStatusNamePipe implements PipeTransform {

  transform(value: {start: Date, end: Date} | undefined): string {
    if(value === undefined ||
      value === null ||
      value.start === null ||
      value.start === undefined ||
      value.end === null ||
      value.end === undefined) {
      return 'unknown'
    }
    const now = Date.now();
    const startTime = value.start.getTime();
    const endTime = value.end.getTime();
    if (now < startTime){
      return 'not started'
    }
    if(now >= startTime && now <= endTime) {
      return 'running'
    }
    return 'finished';
  }

}
