import { inject, Injectable } from '@angular/core';
import { interval, Observable } from 'rxjs';
import { exhaustMap, filter, map, take } from 'rxjs/operators';
import { ExplanationRunStatus } from 'src/app/iterative_planning/domain/explanation/explanations';
import { FlightPlanTreeService } from './flight-plan-tree.service';
import { FlightsHorizon } from '../domain/flight-section';
  
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

function explanationsFinished(section: FlightsHorizon): boolean[] {
    return section.configurations.map(c => c.explanationStatus !== ExplanationRunStatus.RUNNING);
}