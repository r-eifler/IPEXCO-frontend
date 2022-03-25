import { Plan } from './../../../../interface/plan';
import { SelectedIterationStepService } from './../../../../service/planner-runs/selected-iteration-step.service';
import { RunStatus, IterationStep } from 'src/app/interface/run';
import {filter, map, takeUntil} from 'rxjs/operators';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
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
  private unsubscribe$: Subject<any> = new Subject();

  step$: BehaviorSubject<IterationStep>;
  actions$: Observable<string[]>;
  solved$: Observable<boolean>;

    constructor(
      private timeLogger: TimeLoggerService,
      private  currentIterationStepService: SelectedIterationStepService) {

      this.step$ = this.currentIterationStepService.getSelectedObject();
    }

  ngOnInit(): void {
    this.loggerId = this.timeLogger.register('plan-view');

    this.actions$ = this.step$
    .pipe(takeUntil(this.unsubscribe$))
    .pipe(
      filter((step) => !!step && step.hasPlan()),
      map( step => {
        this.timeLogger.addInfo(this.loggerId, 'stepId: ' + step._id);
        let actions = [];
        for (const action of step.plan.plan.actions) {
          const s = action.name + ' ' + action.parameters.map(p => p.name).join(' ');
         actions.push(s);
        }
        return actions
      })
    );

    this.solved$ = this.step$
    .pipe(takeUntil(this.unsubscribe$))
    .pipe(
      filter((step) => !!step && !!step.plan),
      map( step => step.plan.status == RunStatus.finished)
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.timeLogger.deregister(this.loggerId);
  }

}
