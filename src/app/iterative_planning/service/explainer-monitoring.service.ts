import { inject, Injectable } from '@angular/core';
import { tap, map, filter, take, exhaustMap } from 'rxjs/operators';
import { interval, Observable } from 'rxjs';
import { IterationStepService } from './iteration-step.service';
import { IterationStep } from '../domain/iteration_step';
import { ExplanationRunStatus } from '../domain/explanation/explanations';
  
@Injectable({
  providedIn: 'root'
})
export class ExplainerMonitoringService {


    private iterationStepService = inject(IterationStepService);

    explanationComputationFinished$(projectId: string): Observable<void> {
        return interval(5000).pipe(
            exhaustMap(() => this.iterationStepService.getIterationSteps$(projectId).pipe(
                map((iterationStepList) => iterationStepList.every(explanationFinished)),
            )),
            filter(allFinished => allFinished),
            take(1),
            map(() => void undefined),
        );        
    }

    globalExplanationComputationFinished$(projectId: string): Observable<void> {
        return interval(5000).pipe(
            exhaustMap(() => this.iterationStepService.getIterationSteps$(projectId).pipe(
                map((iterationStepList) => iterationStepList.every(explanationFinished)),
            )),
            filter(allFinished => allFinished),
            take(1),
            map(() => void undefined),
        );        
    }

}

function explanationFinished(iterationStep: IterationStep): boolean {
    return (iterationStep.globalExplanation?.status != ExplanationRunStatus.pending) &&
    (iterationStep.globalExplanation?.status != ExplanationRunStatus.running);
}