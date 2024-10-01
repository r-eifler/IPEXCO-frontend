import { parsePlan } from "src/app/service/planner-runs/utils";
import { CurrentProjectService } from "src/app/service/project/project-services";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subject, Observable, combineLatest } from "rxjs";
import { filter, map, takeUntil } from "rxjs/operators";
import { TimeLoggerService } from "src/app/service/logger/time-logger.service";
import {
  PDDLAction,
  PDDLFact,
  factEquals,
  FactToString,
  instantiateAction,
} from "src/app/interface/planning-task";
import { Project } from "src/app/project/domain/project";
import { RunStatus } from "src/app/iterative_planning/domain/run";
import { nextState, Plan, PlanRunStatus, State } from "src/app/iterative_planning/domain/plan";
import { Store } from "@ngrx/store";
import { selectIterativePlanningSelectedStep } from "src/app/iterative_planning/state/iterative-planning.selector";
import { IterationStep } from "src/app/iterative_planning/domain/iteration_step";

interface ExFact {
  fact: PDDLFact;
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

  private ngUnsubscribe: Subject<any> = new Subject();

  runStatus = RunStatus;

  private step$: Observable<IterationStep>;
  private project$: Observable<Project>;

  plan$: Observable<Plan>;

  action_trace: PDDLAction[] = [];
  state_trace: State[] = [];
  state_trace_ex: ExState[] = [];
  states_visible: boolean[] = [];

  constructor(
    private store: Store,
    private timeLogger: TimeLoggerService,
    private currentProjectService: CurrentProjectService
  ) {
    this.step$ = this.store.select(selectIterativePlanningSelectedStep)
    this.project$ = this.currentProjectService.findSelectedObject();
  }

  ngOnInit(): void {

    this.plan$ = this.step$.pipe(
      filter(
        (step) => !!step && step.plan && step.plan.status == PlanRunStatus.plan_found
      ),
      map((step) => step.plan)
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

          let plan: Plan = step.plan

          let action_map: Map<string, PDDLAction> = new Map();
          for (const action of step.task.model.actions) {
            action_map.set(action.name, action);
          }

          let init_state: State = { values: step.task.model.initial };
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
              action.arguments
            );
            i_action.effect.forEach((item) =>
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

            for (let eff of i_action.effect) {
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
            console.log(this.state_trace_ex)
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
  }
}
