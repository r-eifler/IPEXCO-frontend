import {DemoFinishedComponent} from './../demo-finished/demo-finished.component';
import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {Demo} from 'src/app/interface/demo';
import {BehaviorSubject, combineLatest, Subject} from 'rxjs';
import {PlanRun, RunStatus, RunType} from 'src/app/interface/run';
import {ActivatedRoute, Router} from '@angular/router';
import {DemosService, RunningDemoService} from 'src/app/service/demo/demo-services';
import {CurrentProjectService} from 'src/app/service/project/project-services';
import {PlanPropertyMapService} from 'src/app/service/plan-properties/plan-property-services';
import {PlanRunsService} from 'src/app/service/planner-runs/planruns.service';
import {DomainSpecificationService} from 'src/app/service/files/domain-specification.service';
import {TaskSchemaService} from 'src/app/service/task-info/schema.service';
import {take, takeUntil, takeWhile} from 'rxjs/operators';
import {ExecutionSettingsService} from 'src/app/service/settings/execution-settings.service';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ExecutionSettings} from '../../../interface/settings/execution-settings';
import {PlannerService} from '../../../service/planner-runs/planner.service';
import {SelectedPlanRunService} from '../../../service/planner-runs/selected-planrun.service';
import {TimeLoggerService} from '../../../service/logger/time-logger.service';
import {PlanProperty} from '../../../interface/plan-property/plan-property';
import {DemoHelpDialogComponent} from '../demo-help-dialog/demo-help-dialog.component';
import {SelectedQuestionService} from '../../../service/planner-runs/selected-question.service';

@Component({
  selector: 'app-demo-navigator',
  templateUrl: './demo-navigator.component.html',
  styleUrls: ['./demo-navigator.component.scss']
})
export class DemoNavigatorComponent implements OnInit, OnDestroy {

  private loggerId: number;
  private ngUnsubscribe: Subject<any> = new Subject();

  @Output() finishedDemo = new EventEmitter<void>();

  computeNewPlan = false;
  askQuestion = false;
  showAnswer = false;
  plannerBusy = false;

  selectedPlan: PlanRun = null;
  runStatus = RunStatus;

  timerIntervall;

  startTime: number;
  currentTime = 0;

  maxTime = 15000;
  timer: number;

  finished = false;

  demo: Demo;
  runs$: BehaviorSubject<PlanRun[]>;
  settings$: BehaviorSubject<ExecutionSettings>;
  globalHardGoals: PlanProperty[];

  constructor(
    private timeLogger: TimeLoggerService,
    private route: ActivatedRoute,
    private router: Router,
    public settingsService: ExecutionSettingsService,
    private demosService: DemosService,
    private runningDemoService: RunningDemoService,
    private currentProjectService: CurrentProjectService,
    private propertiesService: PlanPropertyMapService,
    public runsService: PlanRunsService,
    private domainSpecService: DomainSpecificationService,
    private currentSchemaService: TaskSchemaService,
    private selectedPlanRunService: SelectedPlanRunService,
    public plannerService: PlannerService,
    private selectedQuestionService: SelectedQuestionService,
    public dialog: MatDialog
  ) {

    this.runningDemoService.getSelectedObject()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        demo => {
          if (demo) {
            this.demo = demo;
            this.runsService.reset();
            this.currentProjectService.saveObject(demo);
            this.currentSchemaService.findSchema(demo);
          }

        }
      );

    this.runs$ = this.runsService.getList();
    this.settings$ = settingsService.getSelectedObject();

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
    this.loggerId = this.timeLogger.register('demo-navigator');
    this.initPlanRuns();
    this.initTimer();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    clearInterval(this.timerIntervall);
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
      timesUp
    };

    const dialogRef = this.dialog.open(DemoFinishedComponent, dialogConfig);

    dialogRef.afterClosed()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        () => {
          this.finishedDemo.emit();
        }
      );
  }

  initTimer() {
    this.settings$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (settings: ExecutionSettings) => {

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

              if (this.timer <= 0 && ! this.finished) {
                this.finished = true;
                this.showDemoFinished(true);
                clearInterval(this.timerIntervall);
              }

            }, 1000);
          }
        }
      );
  }

  async initPlanRuns() {
    const run: PlanRun = {
      _id: this.runsService.getNumRuns().toString(),
      name: 'Plan ' + (this.runsService.getNumRuns() + 1),
      type: RunType.plan,
      status: null,
      project: this.demo,
      planProperties: this.globalHardGoals,
      hardGoals: this.globalHardGoals.map(value => (value.name)),
      log: null,
      explanationRuns: [],
      previousRun: null,
    };

    console.log(run);

    this.plannerService.execute_plan_run(run);
    this.taskCreatorClose(true);
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
  }


  taskCreatorClose(hardGoalsSelected) {
    this.computeNewPlan = false;
    this.askQuestion = false;
    this.showAnswer = false;
    if (hardGoalsSelected) {
      this.selectedPlan = null;
      this.plannerService.isPlannerBusy()
        .pipe(takeWhile(v => v, true))
        .subscribe(
          busy => {
            if (!busy) {
              this.selectPlan(this.runsService.getLastRun());
            }
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
