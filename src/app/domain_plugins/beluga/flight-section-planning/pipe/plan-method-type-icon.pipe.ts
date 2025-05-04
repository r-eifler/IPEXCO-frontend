import { Pipe, PipeTransform } from '@angular/core';

import { PlanMethodType } from '../domain/plan_method';

@Pipe({
  name: 'planMethodTypeIcon',
  standalone: true
})
export class PlanMethodTypeIconPipe implements PipeTransform {

  transform(value: PlanMethodType | undefined){
    if(value === undefined || value === null) {
      return 'question_mark';
    }

    switch (value) {
      case PlanMethodType.MANUAL:
        return 'person';
      case PlanMethodType.AUTOMATIC_SEARCH_PLANNER:
        return 'search';
      case PlanMethodType.ACTION_POLICY:
        return 'rule';
    }
  }

}
