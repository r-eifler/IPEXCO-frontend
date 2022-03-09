import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {ExplanationRun, PlanRun, RunStatus, RunType} from '../../../interface/run';
import {Demo} from '../../../interface/demo';
import {ExecutionSettings} from '../../../interface/settings/execution-settings';
import {PlanProperty} from '../../../interface/plan-property/plan-property';
import {TimeLoggerService} from '../../../service/logger/time-logger.service';
import {ActivatedRoute, Router} from '@angular/router';
import {DemosService, RunningDemoService} from '../../../service/demo/demo-services';
import {CurrentProjectService} from '../../../service/project/project-services';
import {PlanPropertyMapService} from '../../../service/plan-properties/plan-property-services';
import {PlanRunsService} from '../../../service/planner-runs/planruns.service';
import {DomainSpecificationService} from '../../../service/files/domain-specification.service';
import {SelectedPlanRunService} from '../../../service/planner-runs/selected-planrun.service';
import {PlannerService} from '../../../service/planner-runs/planner.service';
import {SelectedQuestionService} from '../../../service/planner-runs/selected-question.service';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {takeUntil, takeWhile} from 'rxjs/operators';
import {DemoFinishedComponent} from '../../demo/demo-finished/demo-finished.component';
import {DemoHelpDialogComponent} from '../../demo/demo-help-dialog/demo-help-dialog.component';

@Component({
  selector: 'app-project-iterative-planning-base',
  templateUrl: './project-iterative-planning-base.component.html',
  styleUrls: ['./project-iterative-planning-base.component.css']
})
export class ProjectIterativePlanningBaseComponent implements OnInit, OnDestroy {

  private loggerId: number;
  private ngUnsubscribe: Subject<any> = new Subject();

  @Output() finishedDemo = new EventEmitter<void>();

  computeNewPlan = false;
  askQuestion = false;
  showAnswer = false;
  plannerBusy = false;

  selectedPlan: PlanRun = null;
  selectedQuestion: ExplanationRun = null;
  runStatus = RunStatus;

  timerIntervall;

  startTime: number;
  currentTime = 0;

  maxTime = 15000;
  timer: number;

  finished = false;

  demo: Demo;
  settings: ExecutionSettings;
  runs$: BehaviorSubject<PlanRun[]>;
  globalHardGoals: PlanProperty[];

  constructor(
    private timeLogger: TimeLoggerService,
    private route: ActivatedRoute,
    private router: Router,
    private demosService: DemosService,
    private runningDemoService: RunningDemoService,
    private currentProjectService: CurrentProjectService,
    private propertiesService: PlanPropertyMapService,
    public runsService: PlanRunsService,
    private domainSpecService: DomainSpecificationService,
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
          }

        }
      );

    this.runs$ = this.runsService.getList();

    this.selectedPlanRunService.getSelectedObject()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        run => {
          this.selectedPlan = run;
          this.askQuestion = false;
          this.showAnswer = false;
        });

    this.selectedQuestionService.getSelectedObject()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        run => {
          this.selectedQuestion = run;
          this.showAnswer = !! run;
        });

    this.settings = this.demo.settings;

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
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    clearInterval(this.timerIntervall);
    this.timeLogger.deregister(this.loggerId);
  }

  selectPlan(planRun: PlanRun) {
    this.selectedPlanRunService.saveObject(planRun);
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
    this.selectedQuestionService.saveObject(null);
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
                this.selectedQuestion = expRun;
                this.showAnswer = true;
              }
            }
          }
        );
    }
  }

  answerViewClose() {
    this.showAnswer = false;
    this.selectedQuestionService.saveObject(null);
  }

  showHelp() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '80%';
    dialogConfig.height = '80%';
    dialogConfig.data  = {
      demo: this.demo
    };

    const dialogRef = this.dialog.open(DemoHelpDialogComponent, dialogConfig);
  }

}
