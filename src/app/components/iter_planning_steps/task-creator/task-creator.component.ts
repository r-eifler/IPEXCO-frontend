import { DisplayTaskService } from './../../../service/display-task.service';
import { CurrentProjectService } from './../../../service/project-services';
import { TasktSchemaStore } from './../../../store/stores.store';
import { PlanProperty } from './../../../interface/plan-property';
import {Component, Input, OnInit} from '@angular/core';
import {Project} from '../../../interface/project';
import {PlanRun, RunType} from '../../../interface/run';
import {PlannerService} from '../../../service/planner.service';
import {BehaviorSubject} from 'rxjs';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {PddlFileUtilsService} from '../../../service/pddl-file-utils.service';
import {Goal, GoalType} from '../../../interface/goal';
import {CurrentProjectStore} from '../../../store/stores.store';
import {ActivatedRoute, Router} from '@angular/router';
import { PlanPropertyCollectionService } from 'src/app/service/plan-property-services';
import { RunService } from 'src/app/service/run-services';
import { filter } from 'rxjs/operators';
import { TaskSchemaService } from 'src/app/service/schema.service';
import { DisplayTask } from 'src/app/interface/display-task';
import { MatSelectionListChange } from '@angular/material/list/selection-list';

@Component({
  selector: 'app-task-creator',
  templateUrl: './task-creator.component.html',
  styleUrls: ['./task-creator.component.scss']
})
export class TaskCreatorComponent implements OnInit {

  private project: Project;
  displayTask: DisplayTask;

  goalFacts: Goal[];
  planPproperties: PlanProperty[];

  selectedGoalFacts: Goal[] = [];
  selectedPlanProperties: PlanProperty[] = [];

  completed = false;

  constructor(
    private currentProjectService: CurrentProjectService,
    private tasktSchemaService: TaskSchemaService,
    private displayTaskService: DisplayTaskService,
    private plannerService: PlannerService,
    private propertiesService: PlanPropertyCollectionService,
    private runService: RunService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.propertiesService.collection$.subscribe(props => this.planPproperties = props.filter((p: PlanProperty) => p.isUsed));
    this.currentProjectService.getSelectedObject().subscribe(project => {
      if (project !== null) {
          this.project = project;
          // this.propertiesService.findCollection([{param: 'projectId', value: this.project._id}]);
      }
    });
    this.tasktSchemaService.getSchema().subscribe(schema => this.goalFacts = schema?.goals);
    this.displayTaskService.getSelectedObject().subscribe(dt => this.displayTask = dt);
  }

  ngOnInit(): void {
  }

  checkComplete(event: MatSelectionListChange) {
    this.completed = this.selectedGoalFacts.length + this.selectedPlanProperties.length > 0;
  }


  computePlan(): void {
    const previousRun = this.runService.getLastRun();
    console.log('Previous Run: ');
    console.log(previousRun);

    const run: PlanRun = {
      _id: null,
      name: 'Plan run ' + (this.runService.getNumRuns() + 1),
      type: RunType.plan,
      status: null,
      project: this.project,
      planProperties: this.selectedPlanProperties,
      hardGoals: this.selectedGoalFacts.concat(this.selectedPlanProperties).map(value => ({name: value.name, goalType: value.goalType }) ),
      log: null,
      planPath: null,
      explanationRuns: [],
      previousRun: previousRun ? previousRun._id : null,
    };

    this.plannerService.execute_plan_run(run);
    this.router.navigate(['../run-overview-mobile'], { relativeTo: this.route });
  }
}
