import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {RunService} from '../../../service/run-services';
import {ProjectsService} from '../../../service/project-services';
import {PlanProperty} from '../../../interface/plan-property';
import { PlanRun } from '../../../interface/run';

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
