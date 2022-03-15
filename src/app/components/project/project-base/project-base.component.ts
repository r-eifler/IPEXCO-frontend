import { PlanningTaskRelaxationService } from './../../../service/planning-task/planning-task-relaxations-services';
import {AnimationSettingsProvider} from './../../../provider/plan-visualisation.provider';
import {QUESTION_REDIRECT} from './../../../app.tokens';
import {PlannerService} from '../../../service/planner-runs/planner.service';
import {DemosService} from '../../../service/demo/demo-services';
import {IterationStepsService} from 'src/app/service/planner-runs/iteration-steps.service';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {Project} from '../../../interface/project';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {switchMap, takeUntil} from 'rxjs/operators';
import {CurrentProjectService, ProjectsService} from 'src/app/service/project/project-services';
import {DomainSpecificationService} from 'src/app/service/files/domain-specification.service';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {PlanPropertyMapService} from 'src/app/service/plan-properties/plan-property-services';
import {PlanVisualizationProvider} from 'src/app/provider/plan-visualisation.provider';
import {PLANNER_REDIRECT} from 'src/app/app.tokens';
import {Subject} from 'rxjs';
import {DemoSettingsComponent} from '../../demo/demo-settings/demo-settings.component';

@Component({
  selector: 'app-project-base',
  templateUrl: './project-base.component.html',
  styleUrls: ['./project-base.component.css'],
  providers: [
     PlanVisualizationProvider,
     AnimationSettingsProvider,
    {provide: IterationStepsService, useClass: IterationStepsService},
    {provide: PlannerService, useClass: PlannerService},
    { provide: PLANNER_REDIRECT, useValue: '../run-overview-mobile' },
    { provide: QUESTION_REDIRECT, useValue: '../../../run-overview-mobile' }
   ],
})
export class ProjectBaseComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject();

  activeLink = '';
  links = [
    {ref: './overview', name: 'Overview'},
    {ref: './settings', name: 'Settings'},
    {ref: './planning-task', name: 'Planning Task'},
    {ref: './properties', name: 'Plan Properties'},
    {ref: './task-relaxations', name: 'Relaxations'},
    {ref: './iterative-planning', name: 'Iterative Planning'}
    ];

  project: Project;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: ProjectsService,
    private currentProjectService: CurrentProjectService,
    private domainSpecService: DomainSpecificationService,
    private propertiesService: PlanPropertyMapService,
    private relaxationService: PlanningTaskRelaxationService,
    private runsService: IterationStepsService,
    private demosService: DemosService,
    private bottomSheet: MatBottomSheet
  ) {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.service.getObject(params.get('projectid')))
    )
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(
      async value => {
        if (value != null) {
          this.project = value;
          this.currentProjectService.saveObject(this.project);
          this.runsService.reset(); // delete possible stored runs which do not belong to the project
          this.runsService.findCollection([{param: 'projectId', value: this.project._id}]);
          this.propertiesService.findCollection([{param: 'projectId', value: this.project._id}]);
          this.relaxationService.findCollection([{param: 'projectId', value: this.project._id}]);
          this.demosService.findCollection([{param: 'projectId', value: this.project._id}]);
        }
      }
    );
  }

  ngOnInit(): void {
    for ( const l of this.links) {
      if (this.router.url.includes(l.ref.replace('./', ''))) {
        this.activeLink = l.ref;
        break;
      }
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  async openSettings() {
    // this.bottomSheet.open(ViewSettingsMenuComponent);
    this.bottomSheet.open(DemoSettingsComponent,
      {data: {settings: this.project.settings, name: this.project.name}});
  }

}
