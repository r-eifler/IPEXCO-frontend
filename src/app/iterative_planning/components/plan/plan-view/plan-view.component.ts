import { Component, DestroyRef, OnDestroy, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { filter, map, take, tap } from "rxjs/operators";
import { IterationStep, StepStatus } from "src/app/iterative_planning/domain/iteration_step";
import { PlanAction, PlanRunStatus } from "src/app/iterative_planning/domain/plan";
import { selectIterativePlanningSelectedStep } from "src/app/iterative_planning/state/iterative-planning.selector";
import { PlannerService } from "src/app/service/planner-runs/planner.service";
import { LogEvent, TimeLoggerService } from "../../../../service/logger/time-logger.service";


@Component({
  selector: "app-plan-view",
  templateUrl: "./plan-view.component.html",
  styleUrls: ["./plan-view.component.scss"],
})
export class PlanViewComponent implements OnInit, OnDestroy {

  step$: Observable<IterationStep>;
  actions$: Observable<PlanAction[]>;
  solved$: Observable<boolean>;
  notSolvable$: Observable<boolean>;
  isRunning$: Observable<boolean>;
  hasPlan$: Observable<boolean>;
  plannerBusy$: Observable<boolean>;

  constructor(
    private store: Store,
    private timeLogger: TimeLoggerService,
    private plannerService: PlannerService,
    private destroyRef: DestroyRef
  ) {
    this.step$ = this.store.select(selectIterativePlanningSelectedStep);
    this.plannerBusy$ = this.plannerService.isPlannerBusy();
  }

  ngOnInit(): void {

    // this.timeLogger.log(LogEvent.START_CHECK_PLAN, {stepId: step._id});

    this.actions$ = this.step$.pipe(
      filter((step) => !!step && !!step.plan && step.plan.status == PlanRunStatus.plan_found),
      tap((step => console.log(step))),
      map((step) => step?.plan?.actions)
    );

    this.solved$ = this.step$.pipe(takeUntilDestroyed(this.destroyRef)).pipe(
      filter((step) => !!step && !!step.plan),
      map((step) => step.plan.status == PlanRunStatus.plan_found),
      tap((a) => console.log(a))
    );

    this.notSolvable$ = this.step$.pipe(takeUntilDestroyed(this.destroyRef)).pipe(
      filter((step) => !!step),
      map((step) => step.status == StepStatus.unsolvable),
      tap((a) => console.log(a))
    );

    this.isRunning$ = this.step$.pipe(takeUntilDestroyed(this.destroyRef)).pipe(
      filter((step) => !!step && !!step.plan),
      map((step) => step.plan.status == PlanRunStatus.pending),
      tap((a) => console.log(a))
    );

    this.hasPlan$ = this.step$.pipe(takeUntilDestroyed(this.destroyRef)).pipe(
      filter((step) => !!step),
      map((step) => !!step.plan),
      tap((a) => console.log(a))
    );
  }

  ngOnDestroy(): void {
    this.step$.pipe(
      filter(s => !!s),
      take(1)
    ).subscribe(step => this.timeLogger.log(LogEvent.END_CHECK_PLAN, {stepId: step._id}))
  }

  computePlan(): void {
    // this.store.dispatch(registerPlanComputation())
    // this.timeLogger.log(LogEvent.COMPUTE_PLAN, {stepId: step._id});
  }
}
