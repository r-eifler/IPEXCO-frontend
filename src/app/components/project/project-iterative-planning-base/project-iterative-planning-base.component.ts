import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {DepExplanationRun, PlanRun, RunStatus} from '../../../interface/run';
import {Demo} from '../../../interface/demo';
import {ExecutionSettings} from '../../../interface/settings/execution-settings';
import {PlanProperty} from '../../../interface/plan-property/plan-property';
import {TimeLoggerService} from '../../../service/logger/time-logger.service';
import {RunningDemoService} from '../../../service/demo/demo-services';
import {CurrentProjectService} from '../../../service/project/project-services';
import {PlanPropertyMapService} from '../../../service/plan-properties/plan-property-services';
import {IterationStepsService} from '../../../service/planner-runs/iteration-steps.service';
import {SelectedPlanRunService} from '../../../service/planner-runs/selected-planrun.service';
import {PlannerService} from '../../../service/planner-runs/planner.service';
import {SelectedQuestionService} from '../../../service/planner-runs/selected-question.service';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {takeUntil, takeWhile} from 'rxjs/operators';
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
  selectedQuestion: DepExplanationRun = null;
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
    private runningDemoService: RunningDemoService,
    private currentProjectService: CurrentProjectService,
    private propertiesService: PlanPropertyMapService,
    public iterationStepService: IterationStepsService,
    public dialog: MatDialog
  ) {

    this.runningDemoService.getSelectedObject()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        demo => {
          if (demo) {
            this.demo = demo;
            this.iterationStepService.reset();
            this.currentProjectService.saveObject(demo);
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
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    clearInterval(this.timerIntervall);
    this.timeLogger.deregister(this.loggerId);
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
