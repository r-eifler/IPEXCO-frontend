import {DemoFinishedComponent} from './../demo-finished/demo-finished.component';
import {AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Demo} from 'src/app/interface/demo';
import {BehaviorSubject, combineLatest, Subject} from 'rxjs';
import {PlanRun, RunStatus} from 'src/app/interface/run';
import {ActivatedRoute, Router} from '@angular/router';
import {DemosService, RunningDemoService} from 'src/app/service/demo/demo-services';
import {CurrentProjectService} from 'src/app/service/project/project-services';
import {PlanPropertyMapService} from 'src/app/service/plan-properties/plan-property-services';
import {IterationStepsService} from 'src/app/service/planner-runs/iteration-steps.service';
import {DomainSpecificationService} from 'src/app/service/files/domain-specification.service';
import {takeUntil, takeWhile} from 'rxjs/operators';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {PlannerService} from '../../../service/planner-runs/planner.service';
import {SelectedPlanRunService} from '../../../service/planner-runs/selected-planrun.service';
import {TimeLoggerService} from '../../../service/logger/time-logger.service';
import {PlanProperty} from '../../../interface/plan-property/plan-property';
import {DemoHelpDialogComponent} from '../demo-help-dialog/demo-help-dialog.component';
import {SelectedQuestionService} from '../../../service/planner-runs/selected-question.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CurrencyPipe} from '@angular/common';
// @ts-ignore
import Timeout = NodeJS.Timeout;

@Component({
  selector: 'app-demo-navigator',
  templateUrl: './demo-navigator.component.html',
  styleUrls: ['./demo-navigator.component.scss']
})
export class DemoNavigatorComponent implements OnInit, AfterViewInit, OnDestroy {

  private loggerId: number;
  private ngUnsubscribe: Subject<any> = new Subject();

  @Output() finishedDemo = new EventEmitter<void>();

  @ViewChild('barContainer') barContainerRef: ElementRef;

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

  constructor(
    private timeLogger: TimeLoggerService,
    private route: ActivatedRoute,
    private router: Router,
    private demosService: DemosService,
    private runningDemoService: RunningDemoService,
    public currentProjectService: CurrentProjectService,
    private propertiesService: PlanPropertyMapService,
    public runsService: IterationStepsService,
    private domainSpecService: DomainSpecificationService,
    private selectedPlanRunService: SelectedPlanRunService,
    public plannerService: PlannerService,
    private selectedQuestionService: SelectedQuestionService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {

    this.runningDemoService.getSelectedObject()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        demo => {
          if (demo) {
            this.demo = demo;
            this.runsService.reset();
            this.currentProjectService.saveObject(demo);
            this.maxUtility = demo.maxUtility?.value;
          }

        }
      );

    // TODO
    // this.runs$ = this.runsService.getList();

    this.propertiesService.getMap()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        props => {
          const propsList = [...props.values()];
          const planProperties = propsList.filter((p: PlanProperty) => p.isUsed);
          this.globalHardGoals = planProperties.filter(v => v.globalHardGoal);
        });
  }

  ngOnInit(): void {
    //TODO check if demo is already initialized
    this.loggerId = this.timeLogger.register('demo-navigator');
    this.initPlanRuns();
    this.initTimer();

    if (this.demo.settings.introTask) {
      const notTimer = setTimeout(() => {
        if (this.demo.settings.allowQuestions && (this.computedPlans === 1 || this.askedQuestions === 0)) {
            this.snackBar.open('You have not computed any plans or asked any questions yet. Are you facing any difficulties? ' +
              'You can open the help page with the button in the upper right corner.', 'OK');
            return;
        }
        if (this.computedPlans === 1) {
            this.snackBar.open('You have not computed any plans yet. Are you facing any difficulties? ' +
              'You can open the help page with the button in the upper right corner.', 'OK');
        }
      }, 120000);
      this.notificationTimer.push(notTimer);
    }
  }


  ngAfterViewInit() {
    if (this.demo.settings.checkMaxUtility) {
      const payInfo = this.demo.settings.paymentInfo;
      const pipe = new CurrencyPipe('en-US', 'GBP');
      for (const s of payInfo.steps) {
        if (s == 1) {
          break;
        }
        const label = document.createElement('div');
        const value = payInfo.min + (payInfo.max - payInfo.min) * s;
        label.innerText = pipe.transform(value, 'GBP', 'symbol', '1.2-2');
        label.style.position = 'absolute';
        label.style.left = (s * 100).toString() + '%';
        label.style.top = '55%';
        this.barContainerRef.nativeElement.appendChild(label);
      }
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
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
    dialogConfig.width = '500px';
    dialogConfig.data  = {
      demo: this.demo,
      maxUtility: this.maxUtility,
      maxAchievedUtility: this.maxAchievedUtility,
      payment: this.payment,
      timesUp
    };

    const dialogRef = this.dialog.open(DemoFinishedComponent, dialogConfig);

    dialogRef.afterClosed()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (result) => {
          if (result) {
            this.snackBar.dismiss();
            this.selectedPlanRunService.removeCurrentObject();
            this.currentProjectService.removeCurrentObject();
            this.finishedDemo.emit();
          }
        }
      );
  }

  initTimer() {
      if (this.demo.settings && (this.demo.settings.measureTime || this.demo.settings.useTimer)) {
        this.maxTime = this.demo.settings.maxTime ? this.demo.settings.maxTime : 50000;
        this.startTime = new Date().getTime();
        this.timerIntervall = setInterval(() => {
          if (this.finished) {
            clearInterval(this.timerIntervall);
          }

          const c = new Date().getTime();
          this.currentTime = c - this.startTime;
          this.timer = this.maxTime - this.currentTime;
          this.timer = this.timer < 0 ? 0 : this.timer;

          if (this.timer <= 0 && ! this.finished) {
            this.finished = true;
            this.showDemoFinished(true);
            clearInterval(this.timerIntervall);
          }

        }, 1000);
      }
  }

  async initPlanRuns() {
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


  selectPlan(planRun: PlanRun) {
    this.selectedPlan = planRun;
    this.selectedPlanRunService.saveObject(planRun);
    this.askQuestion = false;
    this.showAnswer = false;
  }

  newPlanRun() {
    this.computeNewPlan = true;
  }

  newQuestion() {
    this.askQuestion = true;
    this.showAnswer = false;
    this.showGlobalExplanation = false;
  }

  globalExplanation() {
    this.showGlobalExplanation = true;
    this.askQuestion = false;
    this.showAnswer = false;
    this.usedGlobalExplanations++;
  }


  taskCreatorClose(hardGoalsSelected) {
    this.computeNewPlan = false;
    this.askQuestion = false;
    this.showAnswer = false;
    this.showGlobalExplanation = false;
    if (hardGoalsSelected) {
      this.selectedPlan = null;
      this.plannerService.isPlannerBusy()
        .pipe(takeWhile(v => v, true))
        .subscribe(
          busy => {
            // TODO
            // if (!busy) {
            //   this.computedPlans++;
            //   const newRun: PlanRun = this.runsService.getLastRun();
            //   this.selectPlan(newRun);
            //   const cSettings = this.demo.settings;

            //   if (cSettings.introTask && cSettings.allowQuestions && this.computedPlans === 2 && this.askedQuestions === 0) {
            //     this.snackBar.open('Great you computed your first plan. How about asking a question to improve the plan?', 'Got it');
            //   }

            //   if (newRun.planValue) {
            //     this.maxAchievedUtility = Math.max(this.maxAchievedUtility, newRun.planValue());
            //     if (cSettings.checkMaxUtility) {
            //       if (this.maxAchievedUtility > 0 && this.maxUtility > 0) {
            //         this.progressValue = this.maxAchievedUtility / this.maxUtility;
            //         let stepFraction = 0;
            //         for (let i = 0; i < cSettings.paymentInfo.steps.length; i++) {
            //           if (cSettings.paymentInfo.steps[i] <= this.progressValue &&
            //             (i + 1 === cSettings.paymentInfo.steps.length || cSettings.paymentInfo.steps[i + 1] > this.progressValue)) {
            //             stepFraction = cSettings.paymentInfo.steps[i];
            //           }
            //         }
            //         this.payment = cSettings.paymentInfo.min +
            //           stepFraction * (cSettings.paymentInfo.max - cSettings.paymentInfo.min);
            //       }
            //     }
            //   }
            //   if (cSettings.checkMaxUtility && newRun.planValue() === this.demo.maxUtility?.value) {
            //     this.finishDemo();
            //   }
            // }
          }
        );
    }
  }

  questionCreatorClose(questionAsked) {
    this.askQuestion = false;
    if (questionAsked) {
      this.plannerService.isPlannerBusy()
        .pipe(takeWhile(v => v, true))
        .subscribe(
        (busy) => {
          if (! busy) {
            this.askedQuestions++;
            const planRun = this.selectedPlanRunService.getSelectedObject().getValue();
            const expRun = this.selectedQuestionService.getSelectedObject().getValue();
            if (planRun && expRun) {
              this.selectedPlan = planRun;
              this.showAnswer = true;
            }
          }
        }
      );
    }
  }

  globalExplanationClose() {
    this.showGlobalExplanation = false;
  }

  showDemoHelp() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '80%';
    dialogConfig.height = '80%';
    dialogConfig.data  = {
      demo: this.demo
    };

    const dialogRef = this.dialog.open(DemoHelpDialogComponent, dialogConfig);
  }

}
