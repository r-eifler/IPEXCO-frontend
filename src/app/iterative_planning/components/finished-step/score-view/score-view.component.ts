import { Component, Input, OnInit } from "@angular/core";
import { BehaviorSubject, Observable, combineLatest } from "rxjs";
import { filter, map } from "rxjs/operators";
import { getMaximalPlanValue, PlanProperty } from "src/app/iterative_planning/domain/plan-property/plan-property";
import { computePlanValue } from 'src/app/iterative_planning/domain/run';
import { IterationStep, StepStatus } from 'src/app/iterative_planning/domain/iteration_step';
import { Store } from '@ngrx/store';
import { selectIterativePlanningProject, selectIterativePlanningProperties } from 'src/app/iterative_planning/state/iterative-planning.selector';
import { GeneralSettings } from "src/app/project/domain/general-settings";

@Component({
  selector: "app-score-view",
  templateUrl: "./score-view.component.html",
  styleUrls: ["./score-view.component.scss"],
})
export class ScoreViewComponent implements OnInit {
  @Input()
  set step(step: IterationStep) {
    this.step$.next(step);
  }

  private step$ = new BehaviorSubject<IterationStep>(null);
  private planProperties$: Observable<Record<string, PlanProperty>>;

  isSolvable$: Observable<boolean>;
  isUnSolvable$: Observable<boolean>;

  planValue$: Observable<number>;
  maxPlanValue$: Observable<number>;
  overallScore$: Observable<number>;

  settings$: Observable<GeneralSettings>;

  constructor(
    private store: Store,
  ) {
    this.planProperties$ = this.store.select(selectIterativePlanningProperties);
    this.isSolvable$ = this.step$.pipe(
      filter((step) => !!step),
      map((step) => step.status == StepStatus.solvable)
    );

    this.isUnSolvable$ = this.step$.pipe(
      filter((step) => !!step),
      map((step) => step.status == StepStatus.unsolvable)
    );

    this.planValue$ = combineLatest([this.step$, this.planProperties$]).pipe(
      map(([step, planProperties]) => {
        if (!!step && !!planProperties) {
          return computePlanValue(step, planProperties);
        } else {
          return 0;
        }
      })
    );

    this.maxPlanValue$ = this.planProperties$.pipe(
      map((planProperties) => {
        if (!!planProperties) {
          return getMaximalPlanValue(planProperties);
        } else {
          return 0;
        }
      })
    );

   
    this.overallScore$ = this.planValue$;

    this.settings$ = this.store.select(selectIterativePlanningProject).pipe(
      map(p => p?.settings)
    )
  }

  ngOnInit(): void {}
}
