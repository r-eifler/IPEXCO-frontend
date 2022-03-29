import { IterationStep } from './../../../../interface/run';
import { SelectedIterationStepService } from './../../../../service/planner-runs/selected-iteration-step.service';
import { CurrentProjectService } from 'src/app/service/project/project-services';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subject, Observable, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PlanRun, RunStatus } from 'src/app/interface/run';
import { TimeLoggerService } from 'src/app/service/logger/time-logger.service';
import { State } from 'src/app/interface/plan';
import { Project } from 'src/app/interface/project';
import { Action, Fact } from 'src/app/interface/plannig-task';

interface ExFact {
  fact: Fact,
  precon: boolean,
  effect_pos: boolean,
  effect_neg: boolean,
}

interface ExState {
  facts: ExFact[]
}

@Component({
  selector: 'app-interactive-plan-view',
  templateUrl: './interactive-plan-view.component.html',
  styleUrls: ['./interactive-plan-view.component.scss']
})
export class InteractivePlanViewComponent implements OnInit, OnDestroy {

  private loggerId: number;
  private ngUnsubscribe: Subject<any> = new Subject();

  runStatus = RunStatus;

  private step$: BehaviorSubject<IterationStep>;
  private project$: Observable<Project>;

  planRun: PlanRun;

  action_trace: Action[] = [];
  state_trace: State[] = [];
  state_trace_ex: ExState[] = [];
  states_visible: boolean[] = [];

  constructor(
    private timeLogger: TimeLoggerService,
    private  selectIterStepService: SelectedIterationStepService,
    private currentProjectService: CurrentProjectService) {
    this.step$ = this.selectIterStepService.getSelectedObject();
    this.project$ = this.currentProjectService.findSelectedObject();
  }

  ngOnInit(): void {
    this.loggerId = this.timeLogger.register('plan-view');

    combineLatest(
      [this.step$,this.project$]
    ).pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(
      ([step, project]) => {
        if(step && project){
          this.action_trace = [];
          this.state_trace = [];
          this.state_trace_ex = [];
          this.states_visible = [];

          if(! step.plan){
            return;
          }

          this.timeLogger.addInfo(this.loggerId, 'runId: ' + step._id);
          this.planRun = step.plan;

          let action_map: Map<string, Action> = new Map();
          for (const action of project.baseTask.actions){
            action_map.set(action.name, action)
          }

          let init_state = new State(project.baseTask.initial);
          this.state_trace.push(init_state);
          this.state_trace_ex.push({facts: init_state.values.map(v => {return {fact: v, precon: false, effect_pos: false, effect_neg: false}})})

          let used_predicate_names: Set<string> = new Set();

          for(const action of this.planRun.plan.actions){

            const i_action = action_map.get(action.name).instantiate(action.parameters.map(o => o.name));
            i_action.effects.forEach(item => used_predicate_names.add(item.name))
            this.action_trace.push(i_action);

            let newState = this.state_trace[this.state_trace.length - 1].nextState(i_action);
            this.state_trace.push(newState);

            this.state_trace_ex.push({facts: newState.values.map(v => {return {fact: v, precon: false, effect_pos: false, effect_neg: false}})})

            for(let pre of i_action.precondition){
              for(let fact of this.state_trace_ex[this.state_trace_ex.length-2].facts){
                if(pre.equals(fact.fact)){
                  fact.precon = true;
                }
              }
            }

            for(let eff of i_action.effects){
              for(let fact of this.state_trace_ex[this.state_trace_ex.length-2].facts){
                if(eff.equals(fact.fact) && eff.negated){
                    fact.effect_neg = true;
                }
              }
              for(let fact of this.state_trace_ex[this.state_trace_ex.length-1].facts){
                if(eff.equals(fact.fact) && ! eff.negated){
                    fact.effect_pos = true;
                }
              }
            }
          }

          this.state_trace_ex.forEach(state => {
            state.facts = state.facts.filter(f => used_predicate_names.has(f.fact.name));
          });

          this.states_visible = this.state_trace.map(() => true);
        }
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.timeLogger.deregister(this.loggerId);
  }

}
