import { PlannerService } from "src/app/service/planner-runs/planner.service";
import { filter, map, take, takeUntil, tap } from "rxjs/operators";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { LogEvent, TimeLoggerService } from "../../../../service/logger/time-logger.service";
import { parsePlan } from "src/app/service/planner-runs/utils";
import { PDDLAction } from "src/app/interface/planning-task";
import { IterationStep, StepStatus } from "src/app/iterative_planning/domain/iteration_step";
import { PlanAction, PlanRunStatus } from "src/app/iterative_planning/domain/plan";
import { Store } from "@ngrx/store";
import { selectIterativePlanningSelectedStep } from "src/app/iterative_planning/state/iterative-planning.selector";


@Component({
  selector: "app-plan-view",
  templateUrl: "./plan-view.component.html",
  styleUrls: ["./plan-view.component.scss"],
})
export class PlanViewComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<any> = new Subject();

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
    private plannerService: PlannerService
  ) {
    this.step$ = this.store.select(selectIterativePlanningSelectedStep);
    this.plannerBusy$ = this.plannerService.isPlannerBusy();
  }

  ngOnInit(): void {

    this.actions$ = this.step$.pipe(takeUntil(this.unsubscribe$)).pipe(
      filter(
        (step) =>
          !!step && !!step.plan && step.plan.status == PlanRunStatus.plan_found
      ),
      map((step) => {
        this.timeLogger.log(LogEvent.START_CHECK_PLAN, {stepId: step._id});
        let actions = [];
        let plan = step.plan
        return plan.actions;
      })
    );

    this.solved$ = this.step$.pipe(takeUntil(this.unsubscribe$)).pipe(
      filter((step) => !!step && !!step.plan),
      map((step) => step.plan.status == PlanRunStatus.plan_found),
      tap((a) => console.log(a))
    );

    this.notSolvable$ = this.step$.pipe(takeUntil(this.unsubscribe$)).pipe(
      filter((step) => !!step),
      map((step) => step.status == StepStatus.unsolvable),
      tap((a) => console.log(a))
    );

    this.isRunning$ = this.step$.pipe(takeUntil(this.unsubscribe$)).pipe(
      filter((step) => !!step && !!step.plan),
      map((step) => step.plan.status == PlanRunStatus.pending),
      tap((a) => console.log(a))
    );

    this.hasPlan$ = this.step$.pipe(takeUntil(this.unsubscribe$)).pipe(
      filter((step) => !!step),
      map((step) => !!step.plan),
      tap((a) => console.log(a))
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.step$.pipe(
      filter(s => !!s),
      take(1)
    ).subscribe(step => this.timeLogger.log(LogEvent.END_CHECK_PLAN, {stepId: step._id}))
  }

  computePlan(): void {
    this.step$
      .pipe(
        filter((step) => !!step),
        take(1)
      )
      .subscribe((step) => {
        this.plannerService.computePlan(step)
        this.timeLogger.log(LogEvent.COMPUTE_PLAN, {stepId: step._id});
      });
  }
}
