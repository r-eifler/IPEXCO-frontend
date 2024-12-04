import { inject, Injectable } from '@angular/core';
import { tap, map, filter, take, exhaustMap } from 'rxjs/operators';
import { interval, Observable } from 'rxjs';
import { DemoService } from './demo.service';
import { RunStatus } from 'src/app/iterative_planning/domain/run';
import { DemoRunStatus } from 'src/app/demo/domain/demo';
  
@Injectable({
  providedIn: 'root'
})
export class DemoMonitoringService {


    private demoService = inject(DemoService);

    demoComputationFinished$(demoId: string): Observable<void> {
        return interval(5000).pipe(
            exhaustMap(() => this.demoService.getDemo$(demoId).pipe(
                map((demo) => ((demo.status != DemoRunStatus.pending) && (demo.status != DemoRunStatus.running)) ),
            )),
            filter(allFinished => allFinished),
            take(1),
            map(() => void undefined),
        );        
    }

}