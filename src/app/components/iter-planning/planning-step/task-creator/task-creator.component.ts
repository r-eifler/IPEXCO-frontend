import { DisplayTaskService } from '../../../../service/display-task.service';
import { CurrentProjectService } from '../../../../service/project-services';
import { PlanProperty } from '../../../../interface/plan-property';
import { Component, Input, OnInit, Inject, OnDestroy } from '@angular/core';
import {Project} from '../../../../interface/project';
import {PlanRun, RunType} from '../../../../interface/run';
import {PlannerService} from '../../../../service/planner.service';
import {ActivatedRoute, Router} from '@angular/router';
import { PlanPropertyMapService } from 'src/app/service/plan-property-services';
import { RunService } from 'src/app/service/run-services';
import { takeUntil } from 'rxjs/operators';
import { TaskSchemaService } from 'src/app/service/schema.service';
import { DisplayTask } from 'src/app/interface/display-task';
import { MatSelectionListChange } from '@angular/material/list/selection-list';
import { PLANNER_REDIRECT } from 'src/app/app.tokens';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-task-creator',
  templateUrl: './task-creator.component.html',
  styleUrls: ['./task-creator.component.scss']
})
export class TaskCreatorComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject();

  private project: Project;
  public hasGlobalHardGoals = true;

  planProperties: PlanProperty[];

  selectedGoalFacts: PlanProperty[] = [];

  completed = false;

  constructor(
    private currentProjectService: CurrentProjectService,
    private taskSchemaService: TaskSchemaService,
    private plannerService: PlannerService,
    private propertiesService: PlanPropertyMapService,
    private runService: RunService,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(PLANNER_REDIRECT) private redirectURL: string) {

    this.propertiesService.getMap()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(
      props => {
        const propsList = [...props.values()];
        this.planProperties = propsList.filter((p: PlanProperty) => p.isUsed);
        this.hasGlobalHardGoals = this.planProperties.filter(v => v.globalHardGoal).length > 0;
        this.completed = this.hasGlobalHardGoals;
     });

    this.currentProjectService.getSelectedObject()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(project => {
      if (project !== null) {
          this.project = project;
      }
    });

  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  checkComplete(event: MatSelectionListChange) {
    this.completed = this.hasGlobalHardGoals || this.selectedGoalFacts.length > 0;
  }


  async computePlan() {
    const previousRun = this.runService.getLastRun();

    const run: PlanRun = {
      _id: this.runService.getNumRuns().toString(),
      name: 'Plan ' + (this.runService.getNumRuns() + 1),
      type: RunType.plan,
      status: null,
      project: this.project,
      planProperties: this.selectedGoalFacts.concat(this.planProperties.filter(v => v.globalHardGoal)),
      hardGoals: this.selectedGoalFacts.concat(this.planProperties.filter(v => v.globalHardGoal)).map(value => (value.name) ),
      log: null,
      explanationRuns: [],
      previousRun: previousRun ? previousRun._id : null,
    };

    this.plannerService.execute_plan_run(run);
    await this.router.navigate([this.redirectURL], { relativeTo: this.route });
  }
}
