import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Demo} from '../../../interface/demo';
import {DemosService, RunningDemoService} from '../../../service/demo/demo-services';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {ExecutionSettingsService} from '../../../service/settings/execution-settings.service';
import {PLANNER_REDIRECT, QUESTION_REDIRECT} from '../../../app.tokens';
import {PlanRunsService} from '../../../service/planner-runs/planruns.service';
import {PlannerService} from '../../../service/planner-runs/planner.service';
import {UserStudyPlannerService} from '../../../service/planner-runs/user-study-planner.service';
import {DemoRunService} from '../../../service/planner-runs/demo-planruns.service';
import {PlanPropertyMapService} from '../../../service/plan-properties/plan-property-services';

@Component({
  selector: 'app-user-study-demo-view',
  templateUrl: './user-study-demo-view.component.html',
  styleUrls: ['./user-study-demo-view.component.css'],
  providers: [
    {provide: PlanRunsService, useClass: DemoRunService},
    {provide: PlannerService, useClass: UserStudyPlannerService},
    { provide: PLANNER_REDIRECT, useValue: '../' },
    { provide: QUESTION_REDIRECT, useValue: '../../../' },
  ]
})
export class UserStudyDemoViewComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject();

  @Input() demoId: string;
  @Output() next = new EventEmitter<void>();

  step = 0;

  demo: Demo;

  constructor(
    private demosService: DemosService,
    private propertiesService: PlanPropertyMapService,
    private selectedDemoService: RunningDemoService,
  ) { }

  ngOnInit(): void {
    this.demosService.getObject(this.demoId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        demo => {
          if (demo) {
            this.selectedDemoService.saveObject(demo);
            this.propertiesService.findCollection([{param: 'projectId', value: demo._id}]);
            this.demo = demo;
          }
        }
      );
  }

  nextInternalStep() {
    this.step++;
  }

  nextStep() {
    this.next.emit();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
