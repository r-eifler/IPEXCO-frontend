import { IterationStepsService } from './../../../service/planner-runs/iteration-steps.service';
import { ExecutionSettings } from "src/app/interface/settings/execution-settings";
import { DemoFinishedComponent } from "./../demo-finished/demo-finished.component";
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { Demo } from "src/app/interface/demo";
import { BehaviorSubject, combineLatest, Observable, Subject } from "rxjs";
import { computePlanValue, computeRelaxationCost, computeStepUtility, IterationStep, PlanRun, RunStatus } from "src/app/interface/run";
import { RunningDemoService } from "src/app/service/demo/demo-services";
import { CurrentProjectService } from "src/app/service/project/project-services";
import { takeUntil, filter, map, take, tap } from "rxjs/operators";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { TimeLoggerService } from "../../../service/logger/time-logger.service";
import { getMaximalPlanValue, PlanProperty } from "../../../interface/plan-property/plan-property";
import { DemoHelpDialogComponent } from "../demo-help-dialog/demo-help-dialog.component";
import { MatSnackBar } from "@angular/material/snack-bar";
import { CurrencyPipe } from "@angular/common";
// @ts-ignore
import Timeout = NodeJS.Timeout;
import {
  NewIterationStepStoreService,
  SelectedIterationStepService,
} from "src/app/service/planner-runs/selected-iteration-step.service";
import { PlanPropertyMapService } from "src/app/service/plan-properties/plan-property-services";
import { PlanningTaskRelaxationService } from "src/app/service/planning-task/planning-task-relaxations-services";
import { ExecutionSettingsServiceService } from "src/app/service/settings/ExecutionSettingsService.service";
import { PlanningTaskRelaxationSpace } from "src/app/interface/planning-task-relaxation";

@Component({
  selector: "app-demo-navigator",
  templateUrl: "./demo-navigator.component.html",
  styleUrls: ["./demo-navigator.component.scss"],
})
export class DemoNavigatorComponent implements OnInit, OnDestroy {
  private ngUnsubscribe$: Subject<any> = new Subject();

  @Output() finishedDemo = new EventEmitter<void>();

  timerIntervall;

  startTime: number;
  currentTime = 0;

  maxTime = 15000;
  timer: BehaviorSubject<number> = new BehaviorSubject(0);

  notificationTimer: Timeout[] = [];

  finished = false;

  demo$: Observable<Demo>;

  step$: Observable<IterationStep>;
  steps$: Observable<IterationStep[]>;
  newStep$: Observable<IterationStep>;

  private planProperties$: BehaviorSubject<Map<string, PlanProperty>>;
  private relaxationSpaces$: BehaviorSubject<PlanningTaskRelaxationSpace[]>;

  maxPlanValue$: Observable<number>;
  planValue$: Observable<number>;
  relqaxationCost$: Observable<number>;
  overallScore$: Observable<number>;
  settings$: Observable<ExecutionSettings>;
  paymentInfo$: Observable<any>;

  constructor(
    private timeLogger: TimeLoggerService,
    private runningDemoService: RunningDemoService,
    public currentProjectService: CurrentProjectService,
    private selectedIterationStepService: SelectedIterationStepService,
    private newIterationStepService: NewIterationStepStoreService,
    private iterationStepsService: IterationStepsService,
    private planPropertiesMapService: PlanPropertyMapService,
    private planningTaskRelaxationService: PlanningTaskRelaxationService,
    private settingsService: ExecutionSettingsServiceService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.demo$ = this.runningDemoService.getSelectedObject();
    this.step$ = this.selectedIterationStepService.getSelectedObject();
    this.steps$ = this.iterationStepsService.getList();
    this.newStep$ = this.newIterationStepService.getSelectedObject();
    this.planProperties$ = planPropertiesMapService.getMap();
    this.relaxationSpaces$ = planningTaskRelaxationService.getList();

    this.settings$ = this.settingsService.getSelectedObject();

  }

  ngOnInit(): void {
    this.initTimer();

    this.paymentInfo$ = this.settings$.pipe(
      takeUntil(this.ngUnsubscribe$),
      filter(settings => !!settings && !!settings.paymentInfo),
      map(settings => settings.paymentInfo),
      tap(s => console.log("Payment info loaded"))
    )

    this.maxPlanValue$ = this.planProperties$.pipe(
      takeUntil(this.ngUnsubscribe$),
      map((planProperties) => {
        if (!!planProperties && planProperties.size > 0) {
          return getMaximalPlanValue(planProperties);
        } else {
          return 0;
        }
      })
    );

    this.overallScore$ = combineLatest([
      this.steps$,
      this.planProperties$,
      this.relaxationSpaces$,
    ]).pipe(
      takeUntil(this.ngUnsubscribe$),
      filter(([steps, planProperties, spaces]) => !!steps && !!planProperties && planProperties.size > 0 && !! spaces),
      map(([steps, planProperties, spaces]) => {
        let max = 0;
        for(let step of steps){
          let score = computeStepUtility(step, planProperties, spaces);
          max = score > max ? score : max;
        }
        return max;
      })
    );

    this.settings$
      .pipe(
        takeUntil(this.ngUnsubscribe$),
        filter((s) => !!s)
      )
      .subscribe((settings) => {
        console.log(settings);
        if (settings.introTask) {
          let text = "You have not computed any plans yet. Are you facing any difficulties? " +
          "You can open the help page with the button in the upper right corner."
          if (settings.allowQuestions) {
            text = "You have not computed any plans or asked any questions yet. Are you facing any difficulties? " +
            "You can open the help page with the button in the upper right corner."
          }
          const notTimer = setTimeout(() => {
            this.steps$.pipe(
              filter(steps => !!steps),
              take(1),
            ).subscribe(steps => {
              if(steps.length <= 1){
                this.snackBar.open(text, 'OK');
              }
            })
          }, 120000);
          this.notificationTimer.push(notTimer);
        }
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
    clearInterval(this.timerIntervall);
    for (const t of this.notificationTimer) {
      clearTimeout(t);
    }
  }

  finishDemo() {
    this.finished = true;
    this.showDemoFinished(false);
    clearInterval(this.timerIntervall);
  }

  showDemoFinished(timesUp: boolean) {

    combineLatest([this.demo$, this.overallScore$, this.maxPlanValue$, this.settings$]).pipe(
      filter(([demo, maxAchievedUtility, maxPlanValue, settings]) => !!demo),
      take(1)
    ).subscribe(([demo, maxAchievedUtility, maxPlanValue, settings]) => {
      // TODO udate with demo max uitility
      let achieved = (maxAchievedUtility / maxPlanValue);
      let payment = settings.paymentInfo.min;
      for(let step of settings.paymentInfo.steps){
        if(achieved >= step){
          payment = settings.paymentInfo.min + (settings.paymentInfo.max - settings.paymentInfo.min) * achieved
        }
      }

      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = "500px";
      dialogConfig.data = {
      demo: demo,
      maxUtility: maxPlanValue,
      maxAchievedUtility: maxAchievedUtility,
      payment: payment,
      timesUp,
    };

    const dialogRef = this.dialog.open(DemoFinishedComponent, dialogConfig);

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) => {
        if (result) {
          this.snackBar.dismiss();
          this.currentProjectService.removeCurrentObject();
          this.finishedDemo.emit();
        }
      });
    });

  }

  initTimer() {
    this.settings$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((settings) => {
      if (settings && (settings.measureTime || settings.useTimer)) {
        console.log("init Timer")
        this.maxTime = settings.maxTime ? settings.maxTime : 50000;
        this.startTime = new Date().getTime();
        this.timerIntervall = setInterval(() => {
          if (this.finished) {
            clearInterval(this.timerIntervall);
          }

          const c = new Date().getTime();
          this.currentTime = c - this.startTime;
          let timeToGo = this.maxTime - this.currentTime;
          timeToGo = timeToGo < 0 ? 0 : timeToGo
          this.timer.next(timeToGo);

          if (timeToGo <= 0 && !this.finished) {
            this.finished = true;
            this.showDemoFinished(true);
            clearInterval(this.timerIntervall);
          }
        }, 1000);
      }
    });
  }

  showHelp() {
    this.demo$.pipe(
      filter(d => !!d),
      take(1)
    ).subscribe(d => {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = "80%";
      dialogConfig.height = "80%";
      dialogConfig.data = {
        demo: d,
      };

      const dialogRef = this.dialog.open(DemoHelpDialogComponent, dialogConfig);
    });
  }
}
