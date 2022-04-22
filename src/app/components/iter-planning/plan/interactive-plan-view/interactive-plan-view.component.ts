import { parsePlan } from "src/app/service/planner-runs/utils";
import { IterationStep } from "../../../../interface/run";
import { SelectedIterationStepService } from "../../../../service/planner-runs/selected-iteration-step.service";
import { CurrentProjectService } from "src/app/service/project/project-services";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { BehaviorSubject, Subject, Observable, combineLatest } from "rxjs";
import { filter, map, takeUntil } from "rxjs/operators";
import { PlanRun, RunStatus } from "src/app/interface/run";
import { TimeLoggerService } from "src/app/service/logger/time-logger.service";
import { nextState, Plan, State } from "src/app/interface/plan";
import { Project } from "src/app/interface/project";
import {
  Action,
  Fact,
  factEquals,
  FactToString,
  instantiateAction,
} from "src/app/interface/plannig-task";
import { getUpdatedInitialState } from "src/app/interface/planning-task-relaxation";

interface ExFact {
  fact: Fact;
  precon: boolean;
  effect_pos: boolean;
  effect_neg: boolean;
}

interface ExState {
  facts: ExFact[];
}

@Component({
  selector: "app-interactive-plan-view",
  templateUrl: "./interactive-plan-view.component.html",
  styleUrls: ["./interactive-plan-view.component.scss"],
})
export class InteractivePlanViewComponent implements OnInit, OnDestroy {
  toString = FactToString;

  private loggerId: number;
  private ngUnsubscribe: Subject<any> = new Subject();

  runStatus = RunStatus;

  private step$: BehaviorSubject<IterationStep>;
  private project$: Observable<Project>;

  plan$: Observable<Plan>;

  action_trace: Action[] = [];
  state_trace: State[] = [];
  state_trace_ex: ExState[] = [];
  states_visible: boolean[] = [];

  constructor(
    private timeLogger: TimeLoggerService,
    private selectIterStepService: SelectedIterationStepService,
    private currentProjectService: CurrentProjectService
  ) {
    this.step$ = this.selectIterStepService.getSelectedObject();
    this.project$ = this.currentProjectService.findSelectedObject();
  }

  ngOnInit(): void {
    this.loggerId = this.timeLogger.register("plan-view");

    this.plan$ = this.step$.pipe(
      filter(
        (step) => !!step && step.plan && step.plan.status == RunStatus.finished
      ),
      map((step) => parsePlan(step.plan.result, step.task.basetask))
    );

    combineLatest([this.step$, this.plan$])
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(([step, plan]) => {
        if (step && plan) {
          this.action_trace = [];
          this.state_trace = [];
          this.state_trace_ex = [];
          this.states_visible = [];

          if (!step.plan) {
            return;
          }

          this.timeLogger.addInfo(this.loggerId, "runId: " + step._id);
          let plan: Plan = parsePlan(step.plan.result, step.task.basetask);

          let action_map: Map<string, Action> = new Map();
          for (const action of step.task.basetask.actions) {
            action_map.set(action.name, action);
          }

          let init_state: State = { values: getUpdatedInitialState(step.task) };
          this.state_trace.push(init_state);
          this.state_trace_ex.push({
            facts: init_state.values.map((v) => {
              return {
                fact: v,
                precon: false,
                effect_pos: false,
                effect_neg: false,
              };
            }),
          });

          let used_predicate_names: Set<string> = new Set();

          for (const action of plan.actions) {
            const i_action = instantiateAction(
              action_map.get(action.name),
              action.parameters.map((o) => o.name)
            );
            i_action.effects.forEach((item) =>
              used_predicate_names.add(item.name)
            );
            this.action_trace.push(i_action);

            let newState = nextState(
              this.state_trace[this.state_trace.length - 1],
              i_action
            );
            this.state_trace.push(newState);

            this.state_trace_ex.push({
              facts: newState.values.map((v) => {
                return {
                  fact: v,
                  precon: false,
                  effect_pos: false,
                  effect_neg: false,
                };
              }),
            });

            for (let pre of i_action.precondition) {
              for (let fact of this.state_trace_ex[
                this.state_trace_ex.length - 2
              ].facts) {
                if (factEquals(pre, fact.fact)) {
                  fact.precon = true;
                }
              }
            }

            for (let eff of i_action.effects) {
              for (let fact of this.state_trace_ex[
                this.state_trace_ex.length - 2
              ].facts) {
                if (factEquals(eff, fact.fact) && eff.negated) {
                  fact.effect_neg = true;
                }
              }
              for (let fact of this.state_trace_ex[
                this.state_trace_ex.length - 1
              ].facts) {
                if (factEquals(eff, fact.fact) && !eff.negated) {
                  fact.effect_pos = true;
                }
              }
            }
          }

          this.state_trace_ex.forEach((state) => {
            state.facts = state.facts.filter((f) =>
              used_predicate_names.has(f.fact.name)
            );
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
