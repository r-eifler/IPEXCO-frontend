import { Component, OnInit, OnDestroy } from '@angular/core';
import { Demo } from 'src/app/interface/demo';
import { BehaviorSubject, combineLatest, Subject, Observable } from 'rxjs';
import { PlanRun } from 'src/app/interface/run';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { DemosService, RunningDemoService } from 'src/app/service/demo-services';
import { ProjectsService, CurrentProjectService } from 'src/app/service/project-services';
import { PlanPropertyCollectionService } from 'src/app/service/plan-property-services';
import { RunService, CurrentRunService } from 'src/app/service/run-services';
import { DomainSpecificationService } from 'src/app/service/domain-specification.service';
import { DisplayTaskService } from 'src/app/service/display-task.service';
import { TaskSchemaService } from 'src/app/service/schema.service';
import { switchMap, takeUntil, map, filter, flatMap } from 'rxjs/operators';
import { DisplayTask } from 'src/app/interface/display-task';
import { ExecutionSettingsService } from 'src/app/service/execution-settings.service';

@Component({
  selector: 'app-demo-navigator',
  templateUrl: './demo-navigator.component.html',
  styleUrls: ['./demo-navigator.component.scss']
})
export class DemoNavigatorComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject();

  demo: Demo;
  runs$: BehaviorSubject<PlanRun[]>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public settingsService: ExecutionSettingsService,
    private demosService: DemosService,
    private runningDemoService: RunningDemoService,
    private projectsService: ProjectsService,
    private currentProjectService: CurrentProjectService,
    private propertiesService: PlanPropertyCollectionService,
    public runsService: RunService,
    private domainSpecService: DomainSpecificationService,
    private displayTaskService: DisplayTaskService,
    private curretnSchemaService: TaskSchemaService,
    private currentRunService: CurrentRunService,
  ) {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        return this.demosService.getObject(params.get('demoid'));
    }))
    .pipe(takeUntil(this.ngUnsubscribe))
    .pipe(filter((demo: Demo) => demo !== null))
    .pipe(map((demo: Demo) => {
        this.demo = demo;
        this.runningDemoService.saveObject(demo);
        this.runsService.reset();
        return this.demo;
      })
    )
    .subscribe(
      demo => {
          this.projectsService.getObject(this.demo.project).subscribe(project => {
            this.currentProjectService.saveObject(project);
            this.propertiesService.findCollection([{param: 'projectId', value: project._id}]);

            combineLatest([this.curretnSchemaService.findSchema(project), this.domainSpecService.findSpec(project)]).
              subscribe(([taskSchema, domainSpec]) => {
                if (taskSchema && domainSpec) {
                  this.displayTaskService.saveObject(new DisplayTask(taskSchema, domainSpec));
                }
              });
          });
      }
    );

    this.runs$ = this.runsService.getList();
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  newPlanRun() {
    this.router.navigate(['./new-planning-step'], { relativeTo: this.route });
  }

  new_question() {
    this.currentRunService.saveObject(this.runsService.getLastRun());
    this.router.navigate(['./new_question'], { relativeTo: this.route });
  }

}
