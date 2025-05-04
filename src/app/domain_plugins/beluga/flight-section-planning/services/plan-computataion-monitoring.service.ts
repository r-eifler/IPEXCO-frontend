import { inject, Injectable } from '@angular/core';
import { interval, Observable } from 'rxjs';
import { exhaustMap, filter, map, take, tap } from 'rxjs/operators';
import { PlanRunStatus } from 'src/app/iterative_planning/domain/plan';
import { FlightPlanTreeService } from './flight-plan-tree.service';
import { FlightSection } from '../domain/flight-section';
  
@Injectable()
export class SectionPlanComputationMonitoringService {


    private service = inject(FlightPlanTreeService);

    planComputationFinished$(sectionId: string): Observable<void> {
        return interval(5000).pipe(
            exhaustMap(() => this.service.getSectionById$(sectionId).pipe(
                map((section) => planFinished(section)),
            )),
            tap(console.log),
            filter(allFinished => allFinished),
            take(1),
            map(() => void undefined),
        );        
    }

}

function planFinished(section: FlightSection): boolean {
    return section.status !== PlanRunStatus.PENDING && section.status !== PlanRunStatus.RUNNING;
}