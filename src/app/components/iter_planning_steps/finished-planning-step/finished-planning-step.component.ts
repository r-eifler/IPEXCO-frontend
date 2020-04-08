import { Component, OnInit } from '@angular/core';
import {PlanProperty} from '../../../_interface/plan-property';
import {BehaviorSubject} from 'rxjs';
import {Project} from '../../../_interface/project';
import {IterPlanningStep} from '../../../_interface/iter-planning-step';
import {CurrentProjectService, IterPlanningStepService, PlanPropertyCollectionService} from '../../../_service/general-services';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-finished-planning-step',
  templateUrl: './finished-planning-step.component.html',
  styleUrls: ['./finished-planning-step.component.css']
})
export class FinishedPlanningStepComponent implements OnInit {

  softProperties: PlanProperty[] = [];

  hardProperties: PlanProperty[] = [];

  collection$: BehaviorSubject<PlanProperty[]>;
  private currentProject$: BehaviorSubject<Project>;

  private currentStep: IterPlanningStep;
  private previousStep: IterPlanningStep;

  constructor(private propertiesService: PlanPropertyCollectionService,
              private currentProjectService: CurrentProjectService,
              private iterPlanningStepService: IterPlanningStepService,
              private route: ActivatedRoute,
              private router: Router) {
    this.collection$ = this.propertiesService.collection$;
    this.currentProject$ = this.currentProjectService.selectedObject$;

    this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.iterPlanningStepService.getObject(params.get('id')))
    ).subscribe(value => {
      this.currentStep = value.data;
      if (this.currentStep.previousStep) {
        this.iterPlanningStepService.getObject(this.currentStep.previousStep)
          .subscribe(value2 => {
            this.previousStep = value2.data;
          });
      }
    });
  }

  ngOnInit(): void {
    this.propertiesService.findCollection();

    if (this.previousStep !== undefined) {
      this.hardProperties = this.previousStep.run.hard_properties;
      this.softProperties = this.previousStep.run.soft_properties;
    } else {
      console.log('No Previous step');
    }
  }

}
