import {AnimationSettingsProvider} from './../../../provider/plan-visualisation.provider';
import {QUESTION_REDIRECT} from './../../../app.tokens';
import {PlannerService} from '../../../service/planner-runs/planner.service';
import {DemosService} from '../../../service/demo/demo-services';
import {PlanRunsService} from 'src/app/service/planner-runs/planruns.service';
import {ViewSettingsMenuComponent} from '../../settings/view-settings-menu/view-settings-menu.component';
import {TaskSchemaService} from '../../../service/task-info/schema.service';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {Project} from '../../../interface/project';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {switchMap, takeUntil} from 'rxjs/operators';
import {CurrentProjectService, ProjectsService} from 'src/app/service/project/project-services';
import {DomainSpecificationService} from 'src/app/service/files/domain-specification.service';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {PlanPropertyMapService} from 'src/app/service/plan-properties/plan-property-services';
import {combineLatest} from 'rxjs/internal/observable/combineLatest';
import {DisplayTask} from 'src/app/interface/display-task';
import {PlanVisualizationProvider} from 'src/app/provider/plan-visualisation.provider';
import {PLANNER_REDIRECT} from 'src/app/app.tokens';
import {Subject} from 'rxjs';
import {DemoSettingsComponent} from '../../demo/demo-settings/demo-settings.component';
import {ExecutionSettingsService} from '../../../service/settings/execution-settings.service';

@Component({
  selector: 'app-project-base',
  templateUrl: './project-base.component.html',
  styleUrls: ['./project-base.component.css'],
  providers: [
     PlanVisualizationProvider,
     AnimationSettingsProvider,
    {provide: PlanRunsService, useClass: PlanRunsService},
    {provide: PlannerService, useClass: PlannerService},
    { provide: PLANNER_REDIRECT, useValue: '../run-overview-mobile' },
    { provide: QUESTION_REDIRECT, useValue: '../../../run-overview-mobile' }
   ],
})
export class ProjectBaseComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject();

  project: Project;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: ProjectsService,
    private currentProjectService: CurrentProjectService,
    private taskSchemaService: TaskSchemaService,
    private domainSpecService: DomainSpecificationService,
    private propertiesService: PlanPropertyMapService,
    private runsService: PlanRunsService,
    private demosService: DemosService,
    private settingsService: ExecutionSettingsService,
    private bottomSheet: MatBottomSheet
  ) {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.service.getObject(params.get('projectid')))
    )
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(
      value => {
        if (value != null) {
          this.project = value;
          this.currentProjectService.saveObject(this.project);
          this.runsService.reset(); // delete possible stored runs which do not belong to the project
          this.runsService.findCollection([{param: 'projectId', value: this.project._id}]);
          this.propertiesService.findCollection([{param: 'projectId', value: this.project._id}]);
          this.demosService.findCollection([{param: 'projectId', value: this.project._id}]);
        }
      }
    );
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  async openSettings() {
    // this.bottomSheet.open(ViewSettingsMenuComponent);
    await this.settingsService.load(this.project.settings);
    this.bottomSheet.open(DemoSettingsComponent,
      {data: {settings: this.settingsService.getSelectedObject().value, name: this.project.name}});
  }

}
