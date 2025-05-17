import { inject, Injectable } from '@angular/core';
import { interval, Observable } from 'rxjs';
import { exhaustMap, filter, map, take, tap } from 'rxjs/operators';
import { PlanRunStatus } from 'src/app/iterative_planning/domain/plan';
import { FlightPlanTreeService } from './flight-plan-tree.service';
import { FlightSection } from '../domain/flight-section';
import { ExplanationRunStatus } from 'src/app/iterative_planning/domain/explanation/explanations';
  
@Injectable()
export class SectionExplanationComputationMonitoringService {


    private service = inject(FlightPlanTreeService);

    explanationComputationFinished$(sectionId: string): Observable<void> {
        return interval(5000).pipe(
            exhaustMap(() => this.service.getSectionById$(sectionId).pipe(
                map((section) => explanationsFinished(section)),
            )),
            // tap(console.log),
            filter(allFinished => allFinished.reduce((acc,c) => acc && c, true)),
            take(1),
            map(() => void undefined),
        );        
    }

}

function explanationsFinished(section: FlightSection): boolean[] {
    return section.configurations.map(c => c.explanationStatus !== ExplanationRunStatus.RUNNING);
}