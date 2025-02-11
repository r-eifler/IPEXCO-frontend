import { inject, Injectable } from '@angular/core';
import { tap, map, filter, take, exhaustMap } from 'rxjs/operators';
import { interval, Observable } from 'rxjs';
import { IterationStepService } from './iteration-step.service';
import { IterationStep } from '../domain/iteration_step';
import { PlanRunStatus } from '../domain/plan';
  
@Injectable()
export class PlannerMonitoringService {


    private iterationStepService = inject(IterationStepService);

    planComputationFinished$(projectId: string): Observable<void> {
        return interval(5000).pipe(
            exhaustMap(() => this.iterationStepService.getIterationSteps$(projectId).pipe(
                map((iterationStepList) => iterationStepList.every(planFinished)),
            )),
            tap(console.log),
            filter(allFinished => allFinished),
            take(1),
            map(() => void undefined),
        );        
    }

}

function planFinished(iterationStep: IterationStep): boolean {
    return iterationStep.plan?.status !== PlanRunStatus.pending &&
    iterationStep.plan?.status !== PlanRunStatus.running;
}