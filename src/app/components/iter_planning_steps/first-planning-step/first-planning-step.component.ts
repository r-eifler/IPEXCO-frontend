import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {RunService, ProjectsService} from '../../../_service/general-services';
import {PlanProperty} from '../../../_interface/plan-property';
import { PlanRun } from '../../../_interface/run';

@Component({
  selector: 'app-first-planning-step',
  templateUrl: './first-planning-step.component.html',
  styleUrls: ['./first-planning-step.component.css']
})
export class FirstPlanningStepComponent implements OnInit {

  hardProperties: PlanProperty[] =  [];
  softProperties: PlanProperty[] =  [];
  run$: Observable<PlanRun[]>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: ProjectsService,
    private runService: RunService
  ) {
    this.run$ = this.runService.collection$;
  }

  ngOnInit(): void {
  }

}
