import {Component, Input, OnInit} from '@angular/core';
import {PlanProperty} from '../../../interface/plan-property';
import {Project} from '../../../interface/project';
import {PlanRun, RunType} from '../../../interface/run';
import {PlannerService} from '../../../service/planner.service';
import {BehaviorSubject} from 'rxjs';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {PddlFileUtilsService} from '../../../service/pddl-file-utils.service';
import {Goal, GoalType} from '../../../interface/goal';
import {CurrentProjectStore} from '../../../store/stores.store';
import {ActivatedRoute, Router} from '@angular/router';
import { prepareEventListenerParameters } from '@angular/compiler/src/render3/view/template';
import { PlanPropertyCollectionService } from 'src/app/service/plan-property-services';
import { RunService } from 'src/app/service/run-services';

@Component({
  selector: 'app-task-creator',
  templateUrl: './task-creator.component.html',
  styleUrls: ['./task-creator.component.css']
})
export class TaskCreatorComponent implements OnInit {

  hardGoals: Goal[] = [];
  properties$: BehaviorSubject<PlanProperty[]>;
  private project: Project;
  goalFacts: Goal[];

  computing  = false;

  constructor(
    private plannerService: PlannerService,
    private propertiesService: PlanPropertyCollectionService,
    private pddlFileUtilsService: PddlFileUtilsService,
    private currentProjectStore: CurrentProjectStore,
    private runService: RunService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.properties$ = this.propertiesService.collection$;
    this.currentProjectStore.item$.subscribe(value => {
      if (value !== null) {
          this.project = value;
          // console.log(value);
          // console.log(value.problemFile);
          this.pddlFileUtilsService.getGoalFacts(value.problemFile).subscribe(value1 => this.goalFacts = value1);
          this.propertiesService.findCollection([{param: 'projectId', value: this.project._id}]);
      }
    });
  }

  ngOnInit(): void {
  }

  drop(event: CdkDragDrop<Goal[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  compute_dependencies(): void {
    const previousRun = this.runService.getLastRun();
    console.log('Previous Run: ');
    console.log(previousRun);

    this.computing = true;
    const run: PlanRun = {
      _id: null,
      name: 'Planning Task',
      type: RunType.plan,
      status: null,
      project: this.project,
      planProperties: this.hardGoals.filter(value => value.goalType === GoalType.planProperty) as PlanProperty[],
      hardGoals: this.hardGoals.map(value => ({name: value.name, goalType: value.goalType }) ),
      log: null,
      plan: null,
      explanationRuns: [],
      previousRun: previousRun ? previousRun._id : null,
    };
    //
    // console.log('Compute dependencies');
    // console.log(run);

    this.plannerService.execute_plan_run(run);
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
