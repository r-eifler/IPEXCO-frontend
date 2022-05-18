import { PlannerService } from "src/app/service/planner-runs/planner.service";
import { Plan } from "../../../../interface/plan";
import { SelectedIterationStepService } from "../../../../service/planner-runs/selected-iteration-step.service";
import { RunStatus, IterationStep, StepStatus } from "src/app/interface/run";
import { filter, map, take, takeUntil, tap } from "rxjs/operators";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { PlanRun } from "../../../../interface/run";
import { LogEvent, TimeLoggerService } from "../../../../service/logger/time-logger.service";
import { parsePlan } from "src/app/service/planner-runs/utils";

interface Action {
  name: string;
  args: string[];
}

@Component({
  selector: "app-plan-view",
  templateUrl: "./plan-view.component.html",
  styleUrls: ["./plan-view.component.css"],
})
export class PlanViewComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<any> = new Subject();

  step$: BehaviorSubject<IterationStep>;
  actions$: Observable<string[]>;
  solved$: Observable<boolean>;
  notSolvable$: Observable<boolean>;
  isRunning$: Observable<boolean>;
  hasPlan$: Observable<boolean>;
  plannerBusy$: Observable<boolean>;

  constructor(
    private timeLogger: TimeLoggerService,
    private currentIterationStepService: SelectedIterationStepService,
    private plannerService: PlannerService
  ) {
    this.step$ = this.currentIterationStepService.getSelectedObject();
    this.plannerBusy$ = this.plannerService.isPlannerBusy();
  }

  ngOnInit(): void {

    this.actions$ = this.step$.pipe(takeUntil(this.unsubscribe$)).pipe(
      filter(
        (step) =>
          !!step && !!step.plan && step.plan.status == RunStatus.finished
      ),
      map((step) => {
        this.timeLogger.log(LogEvent.START_CHECK_PLAN, {stepId: step._id});
        let actions = [];
        let plan = parsePlan(step.plan.result, step.task.basetask);
        for (const action of plan.actions) {
          const s =
            action.name + " " + action.parameters.map((p) => p.name).join(" ");
          actions.push(s);
        }
        return actions;
      })
    );

    this.solved$ = this.step$.pipe(takeUntil(this.unsubscribe$)).pipe(
      filter((step) => !!step && !!step.plan),
      map((step) => step.plan.status == RunStatus.finished),
      tap((a) => console.log(a))
    );

    this.notSolvable$ = this.step$.pipe(takeUntil(this.unsubscribe$)).pipe(
      filter((step) => !!step),
      map((step) => step.status == StepStatus.unsolvable),
      tap((a) => console.log(a))
    );

    this.isRunning$ = this.step$.pipe(takeUntil(this.unsubscribe$)).pipe(
      filter((step) => !!step && !!step.plan),
      map((step) => step.plan.status == RunStatus.pending),
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
