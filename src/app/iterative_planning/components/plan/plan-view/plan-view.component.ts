import { Component, DestroyRef, OnDestroy, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { filter, map, take, tap } from "rxjs/operators";
import { IterationStep, StepStatus } from "src/app/iterative_planning/domain/iteration_step";
import { PlanAction, PlanRunStatus } from "src/app/iterative_planning/domain/plan";
import { selectIterativePlanningSelectedStep } from "src/app/iterative_planning/state/iterative-planning.selector";
import { MatCardModule } from "@angular/material/card";
import { AsyncPipe, NgFor, NgIf } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";


@Component({
    selector: "app-plan-view",
    imports: [
        MatCardModule,
        AsyncPipe,
        NgIf,
        MatButtonModule,
        NgFor
    ],
    templateUrl: "./plan-view.component.html",
    styleUrls: ["./plan-view.component.scss"]
})
export class PlanViewComponent implements OnInit {

  step$: Observable<IterationStep>;
  actions$: Observable<PlanAction[]>;
  solved$: Observable<boolean>;
  notSolvable$: Observable<boolean>;
  isRunning$: Observable<boolean>;
  hasPlan$: Observable<boolean>;
  plannerBusy$: Observable<boolean>;

  constructor(
    private store: Store,
    private destroyRef: DestroyRef
  ) {
    this.step$ = this.store.select(selectIterativePlanningSelectedStep);
    // this.plannerBusy$ = this.plannerService.isPlannerBusy();
  }

  ngOnInit(): void {

    // this.timeLogger.log(LogEvent.START_CHECK_PLAN, {stepId: step._id});

    this.actions$ = this.step$.pipe(
      filter((step) => !!step && !!step.plan && step.plan.status == PlanRunStatus.plan_found),
      map((step) => step?.plan?.actions)
    );

    this.solved$ = this.step$.pipe(takeUntilDestroyed(this.destroyRef)).pipe(
      filter((step) => !!step && !!step.plan),
      map((step) => step.plan.status == PlanRunStatus.plan_found),
    );

    this.notSolvable$ = this.step$.pipe(takeUntilDestroyed(this.destroyRef)).pipe(
      filter((step) => !!step),
      map((step) => step.status == StepStatus.unsolvable),
    );

    this.isRunning$ = this.step$.pipe(takeUntilDestroyed(this.destroyRef)).pipe(
      filter((step) => !!step && !!step.plan),
      map((step) => step.plan.status == PlanRunStatus.pending),
    );

    this.hasPlan$ = this.step$.pipe(takeUntilDestroyed(this.destroyRef)).pipe(
      filter((step) => !!step),
      map((step) => !!step.plan),
    );
  }


  computePlan(): void {
    // this.store.dispatch(registerPlanComputation())
    // this.timeLogger.log(LogEvent.COMPUTE_PLAN, {stepId: step._id});
  }
}
