import { DemoFinishedComponent } from './../demo-finished/demo-finished.component';
import {Component, OnInit, OnDestroy, Output, EventEmitter} from '@angular/core';
import { Demo } from 'src/app/interface/demo';
import { BehaviorSubject, Subject} from 'rxjs';
import { PlanRun } from 'src/app/interface/run';
import { ActivatedRoute, Router} from '@angular/router';
import { DemosService, RunningDemoService } from 'src/app/service/demo-services';
import { CurrentProjectService } from 'src/app/service/project-services';
import { PlanPropertyMapService } from 'src/app/service/plan-property-services';
import { RunService, CurrentRunService } from 'src/app/service/run-services';
import { DomainSpecificationService } from 'src/app/service/domain-specification.service';
import { DisplayTaskService } from 'src/app/service/display-task.service';
import { TaskSchemaService } from 'src/app/service/schema.service';
import { takeUntil} from 'rxjs/operators';
import { ExecutionSettingsService } from 'src/app/service/execution-settings.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import {ExecutionSettings} from '../../../interface/execution-settings';

@Component({
  selector: 'app-demo-navigator',
  templateUrl: './demo-navigator.component.html',
  styleUrls: ['./demo-navigator.component.scss']
})
export class DemoNavigatorComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject();

  @Output() finishedDemo = new EventEmitter<void>();

  timerIntervall;

  startTime: number;
  currentTime = 0;

  maxTime = 15000;
  timer: number;

  finished = false;

  demo: Demo;
  runs$: BehaviorSubject<PlanRun[]>;
  settings$: BehaviorSubject<ExecutionSettings>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public settingsService: ExecutionSettingsService,
    private demosService: DemosService,
    private runningDemoService: RunningDemoService,
    private currentProjectService: CurrentProjectService,
    private propertiesService: PlanPropertyMapService,
    public runsService: RunService,
    private domainSpecService: DomainSpecificationService,
    private currentSchemaService: TaskSchemaService,
    private currentRunService: CurrentRunService,
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
            this.propertiesService.findCollection([{param: 'projectId', value: demo._id}]);

            this.currentSchemaService.findSchema(demo);
          }

        }
      );

    this.runs$ = this.runsService.getList();
    this.settings$ = settingsService.getSelectedObject();
  }

  ngOnInit(): void {
    this.settings$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (settings: ExecutionSettings) => {
          if (settings && (settings.measureTime || settings.useTimer)) {
            this.maxTime = settings.maxTime;
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

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    clearInterval(this.timerIntervall);
  }

  newPlanRun() {
    this.router.navigate(['./new-planning-step'], { relativeTo: this.route });
  }

  new_question() {
    this.currentRunService.saveObject(this.runsService.getLastRun());
    this.router.navigate(['./new_question'], { relativeTo: this.route });
  }

}
