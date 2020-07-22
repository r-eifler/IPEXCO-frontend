import {RunStatus} from 'src/app/interface/run';
import {takeUntil} from 'rxjs/operators';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {PlanRun} from '../../../../interface/run';
import {SelectedPlanRunService} from '../../../../service/planner-runs/selected-planrun.service';

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

  runStatus = RunStatus;

  planRun: PlanRun;
  private currentRun$: BehaviorSubject<PlanRun>;

    constructor(
      private  currentRunService: SelectedPlanRunService) {
      this.currentRun$ = this.currentRunService.getSelectedObject();
    }

  ngOnInit(): void {
    this.currentRun$
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(run => {
      // console.log('PlanView: current Run: ' + run);
      if (run) {
        this.planRun = run;
      }
    });

  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
