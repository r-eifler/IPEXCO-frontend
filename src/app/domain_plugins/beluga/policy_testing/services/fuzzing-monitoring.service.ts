import { inject, Injectable } from '@angular/core';
import { interval, Observable } from 'rxjs';
import { exhaustMap, filter, map, take, takeUntil, takeWhile, tap } from 'rxjs/operators';
import { PolicyTestingTestCollectionsService } from './tests.service';
import { TestSuite, TestRunStatus } from '../domain/tests';
  
@Injectable()
export class FuzzingMonitoringService {


    private service = inject(PolicyTestingTestCollectionsService);

    planComputationFinished$(testSuidId: string): Observable<true> {
        return interval(5000).pipe(
            exhaustMap(() => this.service.getTestCollection$(testSuidId).pipe(
                map((section) => testingFinished(section)),
            )),
            tap(console.log),
            takeWhile(allFinished => !allFinished, true),
            // filter(allFinished => allFinished),
            // take(1),
            // map(() => void undefined),
        );        
    }

}

function testingFinished(testSuite: TestSuite): boolean {
    return testSuite.status !== TestRunStatus.PENDING && testSuite.status !== TestRunStatus.RUNNING;
}