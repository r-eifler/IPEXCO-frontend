import {Component, Input, OnInit} from '@angular/core';
import {PlanProperty} from '../../../_interface/plan-property';
import {Project} from '../../../_interface/project';
import {PlanRun, RunType} from '../../../_interface/run';
import {PlannerService} from '../../../_service/planner.service';
import {PlanPropertyCollectionService} from '../../../_service/general-services';
import {BehaviorSubject} from 'rxjs';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {PddlFileUtilsService} from '../../../_service/pddl-file-utils.service';
import {Goal, GoalType} from '../../../_interface/goal';
import {CurrentProjectStore} from '../../../store/stores.store';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-task-creator',
  templateUrl: './task-creator.component.html',
  styleUrls: ['./task-creator.component.css']
})
export class TaskCreatorComponent implements OnInit {

  @Input() previousRun: PlanRun;
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
      }
    });
    if ( this.previousRun ) {
      this.hardGoals = this.previousRun.hardGoals;
    }
  }

  ngOnInit(): void {
    this.propertiesService.findCollection();
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
    this.computing = true;
    const run: PlanRun = {
      _id: null,
      name: this.previousRun ? 'Plan' : 'Original Task',
      type: RunType.plan,
      status: null,
      project: this.project,
      planProperties: this.hardGoals.filter(value => value.goalType === GoalType.planProperty) as PlanProperty[],
      hardGoals: this.hardGoals.map(value => ({name: value.name, goalType: value.goalType }) ),
      log: null,
      plan: null,
      explanationRuns: [],
      previousRun: this.previousRun ? this.previousRun._id : null,
    };
    //
    // console.log('Compute dependencies');
    console.log(run);

    this.plannerService.execute_plan_run(run);
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
