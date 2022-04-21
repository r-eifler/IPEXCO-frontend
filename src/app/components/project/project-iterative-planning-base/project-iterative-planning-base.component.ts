import { NewIterationStepService } from './../../../service/planner-runs/selected-iteration-step.service';
import { SelectedIterationStepService } from 'src/app/service/planner-runs/selected-iteration-step.service';
import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import {DepExplanationRun, IterationStep, ModIterationStep, PlanRun, RunStatus} from '../../../interface/run';
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
  private ngUnsubscribe$: Subject<any> = new Subject();

  step$ : Observable<IterationStep>;
  newStep$ : Observable<IterationStep>;

  constructor(
    private timeLogger: TimeLoggerService,
    public iterationStepService: IterationStepsService,
    selectedIterationStepService: SelectedIterationStepService,
    newIterationStepService: NewIterationStepService,
    public dialog: MatDialog
  ) {

    this.step$ = selectedIterationStepService.getSelectedObject();
    this.newStep$ = newIterationStepService.getSelectedObject();

  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
    // clearInterval(this.timerIntervall);
    this.timeLogger.deregister(this.loggerId);
  }

  showHelp() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '80%';
    dialogConfig.height = '80%';
    dialogConfig.data  = {};

    const dialogRef = this.dialog.open(DemoHelpDialogComponent, dialogConfig);
  }

}
