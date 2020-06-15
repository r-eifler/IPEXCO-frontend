import { QUESTION_REDIRECT } from './../../../app.tokens';
import { PlannerService, DemoPlannerService } from './../../../service/planner.service';
import { DemoRunService, CurrentRunService } from './../../../service/run-services';
import { PlanPropertyCollectionService } from './../../../service/plan-property-services';
import { ProjectsService } from './../../../service/project-services';
import { Demo } from './../../../interface/demo';
import { RunningDemoService, DemosService } from './../../../service/demo-services';
import { Component, OnInit, InjectionToken } from '@angular/core';
import { CurrentProjectService } from 'src/app/service/project-services';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { RunService } from 'src/app/service/run-services';
import { CurrentRunStore } from 'src/app/store/stores.store';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { PlanRun } from 'src/app/interface/run';
import { switchMap } from 'rxjs/operators';
import { DisplayTaskService } from 'src/app/service/display-task.service';
import { DomainSpecificationService } from 'src/app/service/domain-specification.service';
import { TaskSchemaService } from 'src/app/service/schema.service';
import { DisplayTask } from 'src/app/interface/display-task';
import { PLANNER_REDIRECT } from 'src/app/app.tokens';


@Component({
  selector: 'app-demo-base',
  templateUrl: './demo-base.component.html',
  styleUrls: ['./demo-base.component.scss'],
  providers: [
    {provide: RunService, useClass: DemoRunService},
    {provide: PlannerService, useClass: DemoPlannerService},
    { provide: PLANNER_REDIRECT, useValue: '../' },
    { provide: QUESTION_REDIRECT, useValue: '../../../' }
  ]
})
export class DemoBaseComponent implements OnInit {

  constructor() {}

  ngOnInit(): void {
  }

}
