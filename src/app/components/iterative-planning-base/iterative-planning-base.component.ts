import { Component, OnInit, Input } from '@angular/core';
import {IterPlanningStepService, ProjectsService} from '../../_service/general-services';
import {IterPlanningStep} from '../../_interface/iter-planning-step';
import {Observable} from 'rxjs';
import {Project} from '../../_interface/project';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-iterative-planning-base',
  templateUrl: './iterative-planning-base.component.html',
  styleUrls: ['./iterative-planning-base.component.css']
})
export class IterativePlanningBaseComponent implements OnInit {

  project: Project;
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
        this.service.getObject(params.get('projectid')))
    ).subscribe(
      value => { this.project = value.data; }
    );
  }

  ngOnInit(): void {
  }

}
