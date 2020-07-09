import {DEMO_FINISHED_REDIRECT, QUESTION_REDIRECT} from './../../../app.tokens';
import {PlannerService} from '../../../service/planner-runs/planner.service';
import {DemoRunService} from '../../../service/planner-runs/run-services';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {RunService} from 'src/app/service/planner-runs/run-services';
import {PLANNER_REDIRECT} from 'src/app/app.tokens';
import {ActivatedRoute, Router} from '@angular/router';
import {takeUntil} from 'rxjs/operators';
import {Demo} from '../../../interface/demo';
import {DemosService, RunningDemoService} from '../../../service/demo/demo-services';
import {Subject} from 'rxjs';
import {ExecutionSettingsService} from '../../../service/settings/execution-settings.service';
import {DemoPlannerService} from '../../../service/planner-runs/demoPlanner.service';


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
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe(
            async (demo: Demo) => {
              if (demo) {
                console.log('DemoBase: Demo loaded: ' + demo._id);
                this.runningDemoService.saveObject(demo);
                // await this.settingsService.load(demo.settings);
                // console.log('Demo settings loaded');
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
