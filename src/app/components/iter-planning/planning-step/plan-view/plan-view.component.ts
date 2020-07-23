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
  actions: string[] = [];
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
        this.niceText();
      }
    });
  }

  niceText() {
    const locationNameMap = new Map<string, string>();
    locationNameMap.set('l0', 'post office');
    locationNameMap.set('l1', 'green house');
    locationNameMap.set('l2', 'orange house');
    locationNameMap.set('l3', 'cafe');
    locationNameMap.set('l4', 'packing station');
    locationNameMap.set('l5', 'blue house');

    const truckNameMap = new Map<string, string>();
    truckNameMap.set('t0', 'red truck');
    truckNameMap.set('t1', 'blue truck');

    for (const action of this.planRun.plan.actions) {
      if (action.name === 'drive') {
          this.actions.push(`The ${truckNameMap.get(action.args[0])}
            drives from the ${locationNameMap.get(action.args[1])} to the ${locationNameMap.get(action.args[2])}.`);
      }
      if (action.name === 'load') {
        this.actions.push(`The ${truckNameMap.get(action.args[1])} loads package
          ${action.args[0].replace('p', '')} at the ${locationNameMap.get(action.args[2])}.`);
      }
      if (action.name === 'unload') {
        this.actions.push(`The ${truckNameMap.get(action.args[1])} unloads package
          ${action.args[0].replace('p', '')} at the ${locationNameMap.get(action.args[2])}.`);
      }
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
