import { DemoFinishedComponent } from "./../demo-finished/demo-finished.component";
import { Component, EventEmitter, OnDestroy, OnInit, Output } from "@angular/core";
import { Demo } from "src/app/interface/demo";
import { BehaviorSubject, combineLatest, Observable, Subject } from "rxjs";
import { CurrentProjectService } from "src/app/service/project/project-services";
import { takeUntil, filter, map, take, tap } from "rxjs/operators";
import { getMaximalPlanValue, PlanProperty } from "../../../iterative_planning/domain/plan-property/plan-property";
import { DemoHelpDialogComponent } from "../demo-help-dialog/demo-help-dialog.component";
// @ts-ignore
import Timeout = NodeJS.Timeout;
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IterationStep } from 'src/app/iterative_planning/domain/iteration_step';
import { Store } from '@ngrx/store';
import { selectIterativePlanningIterationSteps, selectIterativePlanningNewStep, selectIterativePlanningProperties, selectIterativePlanningSelectedStep } from 'src/app/iterative_planning/state/iterative-planning.selector';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GeneralSettings } from "src/app/project/domain/general-settings";


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
  showTaskInfo = false;

  demo$: Observable<Demo>;

  selectedStep$: Observable<IterationStep>;
  steps$: Observable<IterationStep[]>;
  newStep$: Observable<IterationStep>;

  private planProperties$: Observable<Record<string, PlanProperty>>;

  maxPlanValue$: Observable<number>;
  planValue$: Observable<number>;
  relqaxationCost$: Observable<number>;
  overallScore$: Observable<number>;
  settings$: Observable<GeneralSettings>;
  paymentInfo$: Observable<any>;

  constructor(
    private store: Store,
    // private runningDemoService: RunningDemoService,
    public currentProjectService: CurrentProjectService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    // this.demo$ = this.runningDemoService.getSelectedObject()  as BehaviorSubject<Demo>;
    this.selectedStep$ = this.store.select(selectIterativePlanningSelectedStep)
    this.steps$ = this.store.select(selectIterativePlanningIterationSteps)
    this.newStep$ = this.store.select(selectIterativePlanningNewStep)
    this.planProperties$ = this.store.select(selectIterativePlanningProperties)

    this.settings$ = currentProjectService.getSelectedObject().pipe(
      filter(p => !!p),
      map(p => p.settings)
    );

  }

  ngOnInit(): void {
    this.initTimer();

    this.selectedStep$.pipe(
      takeUntilDestroyed(),
      filter(step => !!step)
    ).subscribe(step => {
      this.showTaskInfo = false;
    }
    );


    this.paymentInfo$ = this.settings$.pipe(
      takeUntilDestroyed(),
      filter(settings => !!settings && !!settings.paymentInfo),
      map(settings => settings.paymentInfo),
      tap(s => console.log("Payment info loaded"))
    )

    this.maxPlanValue$ = this.planProperties$.pipe(
      takeUntilDestroyed(),
      map((planProperties) => {
        if (!!planProperties) {
          return getMaximalPlanValue(planProperties);
        } else {
          return 0;
        }
      })
    );

    this.overallScore$ = combineLatest([
      this.steps$,
      this.planProperties$,
    ]).pipe(
      takeUntilDestroyed(),
      filter(([steps, planProperties]) => !!steps && !!planProperties),
      map(([steps, planProperties]) => {
        let max = 0;
        for(let step of steps){
          let score = 0 // TODO computeStepUtility(step, planProperties);
          max = score > max ? score : max;
        }
        return max;
      })
    );

    this.settings$
      .pipe(
        takeUntilDestroyed(),
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
    this.settings$.pipe(takeUntilDestroyed()).subscribe((settings) => {
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

  openTaskInfo() {
    console.log("Open Task Info");
    this.showTaskInfo = true;
  }
}
