import { QUESTION_REDIRECT } from './../../../app.tokens';
import { PlannerService, DemoPlannerService } from './../../../service/planner.service';
import { DemoRunService } from './../../../service/run-services';
import { Component, OnInit } from '@angular/core';
import { RunService } from 'src/app/service/run-services';
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
