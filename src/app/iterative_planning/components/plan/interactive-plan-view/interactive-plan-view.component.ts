import { Component, DestroyRef, OnInit } from "@angular/core";
import { Subject, Observable } from "rxjs";
import { filter, map } from "rxjs/operators";
import { TimeLoggerService } from "src/app/user_study/service/time-logger.service";
import {
  PDDLAction,
  PDDLFact,
  factEquals,
  FactToString,
  instantiateAction,
} from "src/app/shared/domain/planning-task";
import { RunStatus } from "src/app/iterative_planning/domain/run";
import { nextState, Plan, PlanRunStatus, State } from "src/app/iterative_planning/domain/plan";
import { Store } from "@ngrx/store";
import { selectIterativePlanningSelectedStep } from "src/app/iterative_planning/state/iterative-planning.selector";
import { IterationStep } from "src/app/iterative_planning/domain/iteration_step";
import { MatCardModule } from "@angular/material/card";
import { AsyncPipe } from "@angular/common";

interface ExFact {
  fact: PDDLFact;
  precon: boolean;
  effect_pos: boolean;
  effect_neg: boolean;
}

interface ExState {
  facts: ExFact[];
}

interface Trace {
  action_trace: PDDLAction[];
  state_trace: State[];
  state_trace_ex: ExState[];
  states_visible: boolean[];
}

@Component({
    selector: "app-interactive-plan-view",
    imports: [
        MatCardModule,
        AsyncPipe,
    ],
    templateUrl: "./interactive-plan-view.component.html",
    styleUrls: ["./interactive-plan-view.component.scss"]
})
export class InteractivePlanViewComponent implements OnInit {
  toString = FactToString;

  runStatus = RunStatus;

  private step$: Observable<IterationStep>;

  plan$: Observable<Plan>;
  trace$: Observable<Trace>;
;

  constructor(
    private store: Store,
    private timeLogger: TimeLoggerService,
    private destroyRef: DestroyRef
  ) {
    this.step$ = this.store.select(selectIterativePlanningSelectedStep);
  }

  ngOnInit(): void {

    this.plan$ = this.step$.pipe(
      filter((step) => !!step && step.plan && step.plan.status == PlanRunStatus.plan_found),
      map((step) => step.plan)
    );

    this.trace$ = this.step$.pipe(
      filter(step => !!step?.plan && step.plan.status == PlanRunStatus.plan_found),
      map(step => {
        let action_trace: PDDLAction[] = [];
        let state_trace: State[] = [];
        let state_trace_ex: ExState[] = [];
        let states_visible:  boolean[] = [];

        let plan: Plan = step.plan

        let action_map: Map<string, PDDLAction> = new Map();
        for (const action of step.task.model.actions) {
          action_map.set(action.name, action);
        }

        let init_state: State = { values: step.task.model.initial };
        state_trace.push(init_state);
        state_trace_ex.push({
          facts: init_state.values.map((v) => {
            return {
              fact: v,
              precon: false,
              effect_pos: false,
              effect_neg: false,
            };
          }),
        });

        // console.log(state_trace_ex[0])

        let used_predicate_names: Set<string> = new Set();

        for (const action of plan.actions) {
          const i_action = instantiateAction(
            action_map.get(action.name),
            action.arguments
          );
          i_action.effect.forEach((item) =>
            used_predicate_names.add(item.name)
          );
          action_trace.push(i_action);

          let newState = nextState(
            state_trace[state_trace.length - 1],
            i_action
          );
          state_trace.push(newState);

          state_trace_ex.push({
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
            for (let fact of state_trace_ex[state_trace_ex.length - 2].facts) {
              if (factEquals(pre, fact.fact)) {
                fact.precon = true;
              }
            }
          }

          for (let eff of i_action.effect) {
            for (let fact of state_trace_ex[state_trace_ex.length - 2].facts) {
              if (factEquals(eff, fact.fact) && eff.negated) {
                fact.effect_neg = true;
              }
            }
            for (let fact of state_trace_ex[state_trace_ex.length - 1].facts) {
              if (factEquals(eff, fact.fact) && !eff.negated) {
                fact.effect_pos = true;
              }
            }
          }
          // console.log(state_trace_ex)
        }

        // console.log(used_predicate_names)
        state_trace_ex.forEach((state) => {
          state.facts = state.facts.filter((f) =>
            used_predicate_names.has(f.fact.name)
          );
        });

        states_visible = state_trace.map(() => true);

        // console.log(state_trace_ex)

        return {
          action_trace,
          state_trace,
          state_trace_ex,
          states_visible
        }
      }
      ));
  }

}
