import { inject, Injectable } from '@angular/core';
import { interval, Observable } from 'rxjs';
import { exhaustMap, filter, map, take, tap } from 'rxjs/operators';
import { Plan } from '../domain/plan';
import { PlanningPlansService } from './plans.service';
import { PlanRunStatus } from 'src/app/iterative_planning/domain/plan';
  
@Injectable()
export class PlanComputationMonitoringService {


    private service = inject(PlanningPlansService);

    planComputationFinished$(projectId: string): Observable<void> {
        return interval(5000).pipe(
            exhaustMap(() => this.service.getPlans$(projectId).pipe(
                map((plansList) => plansList.every(planFinished)),
            )),
            tap(console.log),
            filter(allFinished => allFinished),
            take(1),
            map(() => void undefined),
        );        
    }

}

function planFinished(plan: Plan): boolean {
    return plan.status !== PlanRunStatus.PENDING && plan.status !== PlanRunStatus.RUNNING;
}