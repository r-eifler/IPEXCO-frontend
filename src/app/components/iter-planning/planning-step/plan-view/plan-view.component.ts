import { SelectedIterationStepService } from './../../../../service/planner-runs/selected-iteration-step.service';
import { RunStatus, IterationStep } from 'src/app/interface/run';
import {takeUntil} from 'rxjs/operators';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {PlanRun} from '../../../../interface/run';
import {TimeLoggerService} from '../../../../service/logger/time-logger.service';

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

  private loggerId: number;
  private ngUnsubscribe: Subject<any> = new Subject();

  runStatus = RunStatus;

  planRun: PlanRun;
  actions: string[] = [];
  private step$: BehaviorSubject<IterationStep>;

    constructor(
      private timeLogger: TimeLoggerService,
      private  currentIterationStepService: SelectedIterationStepService) {

      this.step$ = this.currentIterationStepService.getSelectedObject();
    }

  ngOnInit(): void {
    this.loggerId = this.timeLogger.register('plan-view');

    this.step$
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(step => {
      if (step) {
        this.timeLogger.addInfo(this.loggerId, 'stepId: ' + step._id);
        this.planRun = step.plan;
        this.actions = [];
        if (this.planRun.plan) {
          // this.niceText();
          this.simpleAction();
        }
      }
    });
  }

  simpleAction() {
    for (const action of this.planRun.plan.actions) {
      const s = action.name + ' ' + action.parameters.map(p => p.name).join(' ');
      this.actions.push(s);
    }
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
          this.actions.push(`The ${truckNameMap.get(action.parameters[0].name)}
            drives from the ${locationNameMap.get(action.parameters[1].name)} to the ${locationNameMap.get(action.parameters[2].name)}.`);
      }
      if (action.name === 'load') {
        this.actions.push(`The ${truckNameMap.get(action.parameters[1].name)} loads package
          ${action.parameters[0].name.replace('p', '')} at the ${locationNameMap.get(action.parameters[2].name)}.`);
      }
      if (action.name === 'unload') {
        this.actions.push(`The ${truckNameMap.get(action.parameters[1].name)} unloads package
          ${action.parameters[0].name.replace('p', '')} at the ${locationNameMap.get(action.parameters[2].name)}.`);
      }
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.timeLogger.deregister(this.loggerId);
  }

}
