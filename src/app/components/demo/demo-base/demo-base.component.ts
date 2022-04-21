import { DemoIterationStepsService } from './../../../service/planner-runs/demo-iteration-steps.service';
import { CurrentProjectService } from 'src/app/service/project/project-services';
import {DEMO_FINISHED_REDIRECT, QUESTION_REDIRECT} from './../../../app.tokens';
import {PlannerService} from '../../../service/planner-runs/planner.service';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {IterationStepsService} from 'src/app/service/planner-runs/iteration-steps.service';
import {PLANNER_REDIRECT} from 'src/app/app.tokens';
import {ActivatedRoute, Router} from '@angular/router';
import {takeUntil} from 'rxjs/operators';
import {Demo} from '../../../interface/demo';
import {DemosService, RunningDemoService} from '../../../service/demo/demo-services';
import {Subject} from 'rxjs';
import {DemoPlannerService} from '../../../service/planner-runs/demo-planner.service';
import {PlanPropertyMapService} from '../../../service/plan-properties/plan-property-services';
import {TimeLoggerService} from '../../../service/logger/time-logger.service';
import { PlanningTaskRelaxationService } from 'src/app/service/planning-task/planning-task-relaxations-services';


@Component({
  selector: 'app-demo-base',
  templateUrl: './demo-base.component.html',
  styleUrls: ['./demo-base.component.scss'],
  providers: [
    {provide: IterationStepsService, useClass: DemoIterationStepsService},
    {provide: PlannerService, useClass: DemoPlannerService},
    { provide: PLANNER_REDIRECT, useValue: '../' },
    { provide: QUESTION_REDIRECT, useValue: '../../../' },
    { provide: DEMO_FINISHED_REDIRECT, useValue: '/demos' }
  ]
})
export class DemoBaseComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject();

  // Steps are help, task info and then the demo itself.
  step = 2;
  private loggerId: number;

  constructor(
    private timeLogger: TimeLoggerService,
    private demosService: DemosService,
    private runningDemoService: RunningDemoService,
    private propertiesService: PlanPropertyMapService,
    private relaxationService: PlanningTaskRelaxationService,
    private currentProjectService: CurrentProjectService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.route.params.subscribe(
      params => {
        this.demosService.getObject(params.demoid)
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe(
             (demo: Demo) => {
              if (demo) {
                this.loggerId = this.timeLogger.register('demo-base');
                this.timeLogger.addInfo(this.loggerId, 'demoId: ' + demo._id);
                this.runningDemoService.saveObject(demo);
                this.currentProjectService.saveObject(demo);
                this.propertiesService.findCollection([{param: 'projectId', value: demo._id}]);
                this.relaxationService.findCollection([{param: 'projectId', value: demo._id}]);
              }
            }
          );
      }
    );
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.timeLogger.deregister(this.loggerId);
  }

  async toDemoCollection() {
    this.timeLogger.reset();
    await this.router.navigate(['/demos'], {relativeTo: this.route});
  }

  nextStep() {
    this.step++;
  }

}
