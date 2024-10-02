import { inject, Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { catchError, tap, switchAll, map, filter, switchMap, take, exhaustMap } from 'rxjs/operators';
import { EMPTY, interval, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { IterationStepService } from './iteration-step.service';
import { IterationStep } from '../domain/iteration_step';
import { PlanRunStatus } from '../domain/plan';
  
@Injectable({
  providedIn: 'root'
})
export class PlannerMonitoringService {

    private BASE_URL = environment.apiURL + "planner/";

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