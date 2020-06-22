import { CurrentRunService } from './../../../../service/run-services';
import { takeUntil } from 'rxjs/operators';
import { Plan } from '../../../../interface/plan';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {PlanRun} from '../../../../interface/run';

interface Action {
  name: string;
  args: string[];
}

@Component({
  selector: 'app-plan-view',
  templateUrl: './plan-view.component.html',
  styleUrls: ['./plan-view.component.css']
})
export class PlanViewComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject();

  plan: Plan;
  private currentRun$: BehaviorSubject<PlanRun>;

    constructor(
      private  currentRunService: CurrentRunService) {
      this.currentRun$ = this.currentRunService.getSelectedObject();
    }

  ngOnInit(): void {
    console.log('plan view');
    this.currentRun$
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(run => {
      if (run) {
        this.plan = run.plan;
      }
    });

  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
