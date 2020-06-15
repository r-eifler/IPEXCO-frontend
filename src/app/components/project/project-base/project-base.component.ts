import { QUESTION_REDIRECT } from './../../../app.tokens';
import { PlannerService } from './../../../service/planner.service';
import { DemosService } from './../../../service/demo-services';
import { RunService } from 'src/app/service/run-services';
import { DisplayTaskService } from './../../../service/display-task.service';
import { DisplayTaskStore } from './../../../store/stores.store';
import { defaultViewSettings } from './../../../interface/view-settings';
import { ViewSettingsMenuComponent } from '../../settings/view-settings-menu/view-settings-menu.component';
import { TaskSchemaService } from './../../../service/schema.service';
import { Component, OnInit } from '@angular/core';
import {Project} from '../../../interface/project';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import { ProjectsService, CurrentProjectService } from 'src/app/service/project-services';
import { DomainSpecificationService } from 'src/app/service/domain-specification.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ViewSettingsService } from 'src/app/service/setting.service';
import { PlanPropertyCollectionService } from 'src/app/service/plan-property-services';
import { combineLatest } from 'rxjs/internal/observable/combineLatest';
import { DisplayTask } from 'src/app/interface/display-task';
import { PlanVisualizationProvider } from 'src/app/provider/plan-visualisation.provider';
import { PLANNER_REDIRECT } from 'src/app/app.tokens';

@Component({
  selector: 'app-project-base',
  templateUrl: './project-base.component.html',
  styleUrls: ['./project-base.component.css'],
  providers: [
     PlanVisualizationProvider,
    {provide: RunService, useClass: RunService},
    {provide: PlannerService, useClass: PlannerService},
    { provide: PLANNER_REDIRECT, useValue: '../run-overview-mobile' },
    { provide: QUESTION_REDIRECT, useValue: '../run-overview-mobile' }
   ],
})
export class ProjectBaseComponent implements OnInit {

  project: Project;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: ProjectsService,
    private currentProjectService: CurrentProjectService,
    private curretnSchemaService: TaskSchemaService,
    private domainSpecService: DomainSpecificationService,
    private propertiesService: PlanPropertyCollectionService,
    private runsService: RunService,
    private displayTaskService: DisplayTaskService,
    private demosService: DemosService,
    private bottomSheet: MatBottomSheet
  ) {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.service.getObject(params.get('projectid')))
    ).subscribe(
      value => {
        if (value != null) {
          this.project = value;
          this.currentProjectService.saveObject(this.project);
          this.runsService.findCollection([{param: 'projectId', value: this.project._id}]);
          this.propertiesService.findCollection([{param: 'projectId', value: this.project._id}]);
          this.demosService.findCollection([{param: 'projectId', value: this.project._id}]);

          combineLatest([this.curretnSchemaService.findSchema(this.project), this.domainSpecService.findSpec(this.project)]).
            subscribe(([taskSchema, domainSpec]) => {
              if(taskSchema && domainSpec) {
                this.displayTaskService.saveObject(new DisplayTask(taskSchema, domainSpec));
              }
            });
        }
      }
    );
  }

  ngOnInit(): void {
  }

  openSettings() {
    this.bottomSheet.open(ViewSettingsMenuComponent);
  }

}
