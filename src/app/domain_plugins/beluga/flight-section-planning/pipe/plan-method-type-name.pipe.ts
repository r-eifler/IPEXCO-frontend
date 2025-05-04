import { Pipe, PipeTransform } from '@angular/core';

import { PlanMethodType } from '../domain/plan_method';

@Pipe({
  name: 'planMethodTypeName',
  standalone: true
})
export class PlanMethodTypeNamePipe implements PipeTransform {

  transform(value: PlanMethodType | undefined){
    if(value === undefined || value === null) {
      return 'Unknown';
    }

    switch (value) {
      case PlanMethodType.MANUAL:
        return 'Manual';
      case PlanMethodType.AUTOMATIC_SEARCH_PLANNER:
        return 'Search';
      case PlanMethodType.ACTION_POLICY:
        return 'Policy';
    }
  }

}
