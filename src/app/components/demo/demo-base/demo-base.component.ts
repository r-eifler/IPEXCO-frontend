import {DEMO_FINISHED_REDIRECT, QUESTION_REDIRECT} from './../../../app.tokens';
import { PlannerService, DemoPlannerService } from './../../../service/planner.service';
import { DemoRunService } from './../../../service/run-services';
import {Component, OnDestroy, OnInit} from '@angular/core';
import { RunService } from 'src/app/service/run-services';
import { PLANNER_REDIRECT } from 'src/app/app.tokens';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {filter, map, switchMap, takeUntil} from 'rxjs/operators';
import {Demo} from '../../../interface/demo';
import {DemosService, RunningDemoService} from '../../../service/demo-services';
import {Subject} from 'rxjs';
import {ExecutionSettingsService} from '../../../service/execution-settings.service';


@Component({
  selector: 'app-demo-base',
  templateUrl: './demo-base.component.html',
  styleUrls: ['./demo-base.component.scss'],
  providers: [
    {provide: RunService, useClass: DemoRunService},
    {provide: PlannerService, useClass: DemoPlannerService},
    { provide: PLANNER_REDIRECT, useValue: '../' },
    { provide: QUESTION_REDIRECT, useValue: '../../../' },
    { provide: DEMO_FINISHED_REDIRECT, useValue: '/demos' }
  ]
})
export class DemoBaseComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject();

  step = 0;

  constructor(
    private demosService: DemosService,
    private runningDemoService: RunningDemoService,
    private settingsService: ExecutionSettingsService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.route.params.subscribe(
      params => {
        this.demosService.getObject(params.demoid)
          .subscribe(
            (demo: Demo) => {
              if (demo) {
                this.runningDemoService.saveObject(demo);
                this.settingsService.load(demo.settings);
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
    clearInterval();
  }

  toDemoCollection() {
    this.router.navigate(['/demos'], { relativeTo: this.route });
  }

  nextStep() {
    this.step++;
  }

}
