import { inject, Injectable } from '@angular/core';
import { interval, Observable } from 'rxjs';
import { exhaustMap, filter, map, take, tap } from 'rxjs/operators';
import { PolicyTestingTestCollectionsService } from './tests.service';
import { TestCollection, TestRunStatus } from '../domain/test-case';
  
@Injectable()
export class FuzzingMonitoringService {


    private service = inject(PolicyTestingTestCollectionsService);

    planComputationFinished$(testSuidId: string): Observable<void> {
        return interval(5000).pipe(
            exhaustMap(() => this.service.getTestCollection$(testSuidId).pipe(
                map((section) => testingFinished(section)),
            )),
            tap(console.log),
            filter(allFinished => allFinished),
            take(1),
            map(() => void undefined),
        );        
    }

}

function testingFinished(testSuite: TestCollection): boolean {
    return testSuite.status !== TestRunStatus.PENDING && testSuite.status !== TestRunStatus.RUNNING;
}