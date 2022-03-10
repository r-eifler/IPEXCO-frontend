import { CurrentProjectService } from 'src/app/service/project/project-services';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subject, Observable, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PlanRun, RunStatus } from 'src/app/interface/run';
import { TimeLoggerService } from 'src/app/service/logger/time-logger.service';
import { SelectedPlanRunService } from 'src/app/service/planner-runs/selected-planrun.service';
import { State } from 'src/app/interface/plan';
import { CursorError } from '@angular/compiler/src/ml_parser/lexer';
import { Project } from 'src/app/interface/project';
import { Action, Fact, Predicat } from 'src/app/interface/plannig-task';

@Component({
  selector: 'app-interactive-plan-view',
  templateUrl: './interactive-plan-view.component.html',
  styleUrls: ['./interactive-plan-view.component.scss']
})
export class InteractivePlanViewComponent implements OnInit, OnDestroy {

  private loggerId: number;
  private ngUnsubscribe: Subject<any> = new Subject();

  runStatus = RunStatus;

  private currentRun$: BehaviorSubject<PlanRun>;
  private project$: Observable<Project>;

  planRun: PlanRun;

  action_trace: Action[] = [];
  state_trace: State[] = [];
  states_visible: boolean[] = [];

  constructor(
    private timeLogger: TimeLoggerService,
    private  currentRunService: SelectedPlanRunService,
    private currentProjectService: CurrentProjectService) {
    this.currentRun$ = this.currentRunService.getSelectedObject();
    this.project$ = this.currentProjectService.findSelectedObject();
  }

  ngOnInit(): void {
    this.loggerId = this.timeLogger.register('plan-view');

    combineLatest(
      this.currentRun$,
      this.project$
    ).pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(
      ([run, project]) => {
        if(run && project){
          this.timeLogger.addInfo(this.loggerId, 'runId: ' + run._id);
          this.planRun = run;

          console.log(run);

          let action_map: Map<string, Action> = new Map();
          for (const action of project.baseTask.actions){
            action_map.set(action.name, action)
          }

          this.state_trace.push(new State(project.baseTask.init));

          let used_effects: Set<Fact> = new Set();

          for(const action of this.planRun.plan.actions){
            const i_action = action_map.get(action.name).instantiate(action.parameters.map(o => o.name));
            i_action.effects.forEach(item => used_effects.add(item))
            this.action_trace.push(i_action);
            this.state_trace.push(this.state_trace[this.state_trace.length - 1].nextState(i_action));
          }

          // Filter not changed predicates
          let used_predicates: Set<Fact> = new Set();
          for(let eff of used_effects){
            used_predicates.add(eff);
          }

          this.state_trace.forEach(state => {
            state.values = state.values.filter(
              v => used_predicates.has(v))
          });

          this.state_trace.forEach(state => {
            state.values.sort();
          });

          this.states_visible = this.state_trace.map(() => false);

          console.log(this.state_trace);
          console.log(this.action_trace);
        }
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.timeLogger.deregister(this.loggerId);
  }

}
