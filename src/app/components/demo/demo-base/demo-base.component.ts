import {DEMO_FINISHED_REDIRECT, QUESTION_REDIRECT} from './../../../app.tokens';
import { PlannerService, DemoPlannerService } from './../../../service/planner.service';
import { DemoRunService } from './../../../service/run-services';
import { Component, OnInit } from '@angular/core';
import { RunService } from 'src/app/service/run-services';
import { PLANNER_REDIRECT } from 'src/app/app.tokens';
import {ActivatedRoute, Router} from '@angular/router';


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
export class DemoBaseComponent implements OnInit {

  step = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
  }

  toDemoCollection() {
    this.router.navigate(['/demos'], { relativeTo: this.route });
  }

  nextStep() {
    this.step++;
  }

}
