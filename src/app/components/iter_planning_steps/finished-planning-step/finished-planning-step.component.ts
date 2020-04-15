import { Component, OnInit } from '@angular/core';
import {PlanProperty} from '../../../_interface/plan-property';
import {BehaviorSubject} from 'rxjs';
import {Project} from '../../../_interface/project';
import {CurrentProjectService, RunService, PlanPropertyCollectionService, CurrentRunService} from '../../../_service/general-services';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {Goal} from '../../../_interface/goal';
import {PlanRun} from '../../../_interface/run';

@Component({
  selector: 'app-finished-planning-step',
  templateUrl: './finished-planning-step.component.html',
  styleUrls: ['./finished-planning-step.component.css']
})
export class FinishedPlanningStepComponent implements OnInit {

  softGoals: Goal[] = [];

  hardGoals: Goal[] = [];

  collection$: BehaviorSubject<PlanProperty[]>;
  private currentProject$: BehaviorSubject<Project>;

  currentRun: PlanRun;
  private previousRun: PlanRun;

  constructor(private propertiesService: PlanPropertyCollectionService,
              private currentProjectService: CurrentProjectService,
              private iterPlanningStepService: RunService,
              private route: ActivatedRoute,
              currentRunService: CurrentRunService) {
    this.collection$ = this.propertiesService.collection$;
    this.currentProject$ = this.currentProjectService.selectedObject$;

    this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.iterPlanningStepService.getObject(params.get('runid')))
    ).subscribe(value => {
      currentRunService.saveObject(value);
      // if (this.currentRun.previousRun !== undefined) {
      //   this.iterPlanningStepService.getObject(this.currentRun.previousRun)
      //     .subscribe(value2 => {
      //       this.previousRun = value2;
      //     });
      // }
    });
  }

  ngOnInit(): void {
    this.propertiesService.findCollection();
  }

}
