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
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { IterationStep, PlanRun, RunStatus } from "src/app/interface/run";
import { RunningDemoService } from "src/app/service/demo/demo-services";
import { CurrentProjectService } from "src/app/service/project/project-services";
import { takeUntil, filter, map } from "rxjs/operators";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { TimeLoggerService } from "../../../service/logger/time-logger.service";
import { PlanProperty } from "../../../interface/plan-property/plan-property";
import { DemoHelpDialogComponent } from "../demo-help-dialog/demo-help-dialog.component";
import { MatSnackBar } from "@angular/material/snack-bar";
import { CurrencyPipe } from "@angular/common";
// @ts-ignore
import Timeout = NodeJS.Timeout;
import {
  NewIterationStepStoreService,
  SelectedIterationStepService,
} from "src/app/service/planner-runs/selected-iteration-step.service";

@Component({
  selector: "app-demo-navigator",
  templateUrl: "./demo-navigator.component.html",
  styleUrls: ["./demo-navigator.component.scss"],
})
export class DemoNavigatorComponent implements OnInit, OnDestroy {
  private loggerId: number;
  private ngUnsubscribe$: Subject<any> = new Subject();

  @Output() finishedDemo = new EventEmitter<void>();

  @ViewChild("barContainer") barContainerRef: ElementRef;

  computeNewPlan = false;
  askQuestion = false;
  showAnswer = false;
  showGlobalExplanation = false;
  plannerBusy = false;

  selectedPlan: PlanRun = null;
  runStatus = RunStatus;

  timerIntervall;

  startTime: number;
  currentTime = 0;

  maxTime = 15000;
  timer: number;

  notificationTimer: Timeout[] = [];

  maxAchievedUtility = 0;
  maxUtility = 0;
  progressValue = 0;
  payment = 0;
  maxPayment = 0;

  computedPlans = 0;
  askedQuestions = 0;
  usedGlobalExplanations = 0;

  finished = false;

  demo: Demo;
  runs$: BehaviorSubject<PlanRun[]>;
  globalHardGoals: PlanProperty[];

  step$: Observable<IterationStep>;
  newStep$: Observable<IterationStep>;

  settings$: Observable<ExecutionSettings>;

  constructor(
    private timeLogger: TimeLoggerService,
    private runningDemoService: RunningDemoService,
    public currentProjectService: CurrentProjectService,
    private selectedIterationStepService: SelectedIterationStepService,
    private newIterationStepService: NewIterationStepStoreService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.step$ = this.selectedIterationStepService.getSelectedObject();
    this.newStep$ = this.newIterationStepService.getSelectedObject();

    this.settings$ = this.runningDemoService.getSelectedObject().pipe(
      filter((d) => !!d),
      map((d) => d.settings)
    );

    // this.runningDemoService.getSelectedObject()
    //   .pipe(takeUntil(this.ngUnsubscribe$))
    //   .subscribe(
    //     demo => {
    //       if (demo) {
    //         this.demo = demo;
    //         // this.runsService.reset();
    //         this.currentProjectService.saveObject(demo);
    //         this.maxUtility = demo.maxUtility?.value;
    //       }

    //     }
    //   );
  }

  ngOnInit(): void {
    //TODO check if demo is already initialized
    this.loggerId = this.timeLogger.register("demo-navigator");
    this.initPlanRuns();
    this.initTimer();

    this.settings$
      .pipe(
        takeUntil(this.ngUnsubscribe$),
        filter((s) => !!s)
      )
      .subscribe((settings) => {
        if (settings.introTask) {
          const notTimer = setTimeout(() => {
            //TODO update
            if (settings.allowQuestions) {
              this.snackBar.open(
                "You have not computed any plans or asked any questions yet. Are you facing any difficulties? " +
                  "You can open the help page with the button in the upper right corner.",
                "OK"
              );
              return;
            }
            if (this.computedPlans === 1) {
              this.snackBar.open(
                "You have not computed any plans yet. Are you facing any difficulties? " +
                  "You can open the help page with the button in the upper right corner.",
                "OK"
              );
            }
          }, 120000);
          this.notificationTimer.push(notTimer);
        }
      });
  }

  //TODO do in score component
  // ngAfterViewInit() {
  //   this.settings$.subscribe(settings => {
  //     if (this.demo.settings.checkMaxUtility) {
  //       const payInfo = this.demo.settings.paymentInfo;
  //       const pipe = new CurrencyPipe('en-US', 'GBP');
  //       for (const s of payInfo.steps) {
  //         if (s == 1) {
  //           break;
  //         }
  //         const label = document.createElement('div');
  //         const value = payInfo.min + (payInfo.max - payInfo.min) * s;
  //         label.innerText = pipe.transform(value, 'GBP', 'symbol', '1.2-2');
  //         label.style.position = 'absolute';
  //         label.style.left = (s * 100).toString() + '%';
  //         label.style.top = '55%';
  //         this.barContainerRef.nativeElement.appendChild(label);
  //       }
  //     }
  //   });
  // }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
    clearInterval(this.timerIntervall);
    for (const t of this.notificationTimer) {
      clearTimeout(t);
    }
    this.timeLogger.deregister(this.loggerId);
  }

  finishDemo() {
    this.finished = true;
    this.showDemoFinished(false);
    clearInterval(this.timerIntervall);
  }

  showDemoFinished(timesUp: boolean) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "500px";
    dialogConfig.data = {
      demo: this.demo,
      maxUtility: this.maxUtility,
      maxAchievedUtility: this.maxAchievedUtility,
      payment: this.payment,
      timesUp,
    };

    const dialogRef = this.dialog.open(DemoFinishedComponent, dialogConfig);

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((result) => {
        if (result) {
          this.snackBar.dismiss();
          this.currentProjectService.removeCurrentObject();
          this.finishedDemo.emit();
        }
      });
  }

  initTimer() {
    this.settings$.subscribe((settings) => {
      if (settings && (settings.measureTime || settings.useTimer)) {
        this.maxTime = settings.maxTime ? settings.maxTime : 50000;
        this.startTime = new Date().getTime();
        this.timerIntervall = setInterval(() => {
          if (this.finished) {
            clearInterval(this.timerIntervall);
          }

          const c = new Date().getTime();
          this.currentTime = c - this.startTime;
          this.timer = this.maxTime - this.currentTime;
          this.timer = this.timer < 0 ? 0 : this.timer;

          if (this.timer <= 0 && !this.finished) {
            this.finished = true;
            this.showDemoFinished(true);
            clearInterval(this.timerIntervall);
          }
        }, 1000);
      }
    });
  }

  async initPlanRuns() {
    // TODO move this to service
    // const run: PlanRun = new PlanRun('Plan ' + (this.runsService.getNumRuns() + 1), RunStatus.pending);
    // run._id= this.runsService.getNumRuns().toString();
    //   name: 'Plan ' + (this.runsService.getNumRuns() + 1),
    //   status: null,
    //   planProperties: this.globalHardGoals,
    //   hardGoals: this.globalHardGoals.map(value => (value.name)),
    //   log: null,
    //   explanationRuns: [],
    //   previousRun: null,
    // };
    // console.log(run);
    // this.plannerService.execute_plan_run(run);
    // this.taskCreatorClose(true);
  }

  showHelp() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "80%";
    dialogConfig.height = "80%";
    dialogConfig.data = {
      demo: this.demo,
    };

    const dialogRef = this.dialog.open(DemoHelpDialogComponent, dialogConfig);
  }
}
