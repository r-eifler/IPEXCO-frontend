import { Component, OnInit } from '@angular/core';
import {Project} from '../../../_interface/project';
import {Observable} from 'rxjs';
import {IterPlanningStep} from '../../../_interface/iter-planning-step';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {IterPlanningStepService, ProjectsService} from '../../../_service/general-services';
import {switchMap} from 'rxjs/operators';
import {PlanProperty} from '../../../_interface/plan-property';

@Component({
  selector: 'app-first-planning-step',
  templateUrl: './first-planning-step.component.html',
  styleUrls: ['./first-planning-step.component.css']
})
export class FirstPlanningStepComponent implements OnInit {

  project: Project;
  hardProperties: PlanProperty[] =  [];
  softProperties: PlanProperty[] =  [];
  iterPlanningSteps$: Observable<IterPlanningStep[]>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: ProjectsService,
    private iterPlanningStepService: IterPlanningStepService
  ) {
    this.iterPlanningSteps$ = this.iterPlanningStepService.collection$;
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.service.getObject(params.get('id')))
    ).subscribe(
      value => { this.project = value.data; }
    );
  }

  ngOnInit(): void {
  }

}
