import {Component, Input, OnInit} from '@angular/core';
import {PlanProperty} from '../../../interface/plan-property';
import {Observable} from 'rxjs';
import {Project} from '../../../interface/project';
import {PlannerService} from '../../../service/planner.service';
import {MatDialog} from '@angular/material/dialog';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {PropertyCreatorComponent} from '../../plan_properties/property-creator/property-creator.component';
import {ExplanationRun, PlanRun, RunType} from '../../../interface/run';
import {CurrentRunStore} from '../../../store/stores.store';
import {Goal} from '../../../interface/goal';
import { PlanPropertyCollectionService } from 'src/app/service/plan-property-services';
import { CurrentProjectService } from 'src/app/service/project-services';

@Component({
  selector: 'app-question-creator',
  templateUrl: './question-creator.component.html',
  styleUrls: ['./question-creator.component.css']
})
export class QuestionCreatorComponent implements OnInit {

  question: PlanProperty[] = [];

  collection: PlanProperty[];
  private currentProject$: Observable<Project>;
  private currentRun: PlanRun;
  private hardGoals: Goal[];

  private currentProject: Project;

  constructor(private propertiesService: PlanPropertyCollectionService,
              private currentProjectService: CurrentProjectService,
              private plannerService: PlannerService,
              private currentRunStore: CurrentRunStore) {
    this.propertiesService.collection$.subscribe(value => {
      this.collection = value;
    });
    this.currentProjectService.selectedObject$.subscribe(project => {
      this.currentProject = project;
      if (project) {
        this.propertiesService.findCollection([{param: 'projectId', value: this.currentProject._id}]);
      }
    });

    this.currentRunStore.item$.subscribe(value => {
      this.currentRun = value;
      if (value != null) {
        this.hardGoals = value.hardGoals;
      }
    });
  }

  ngOnInit(): void {
  }

  drop(event: CdkDragDrop<PlanProperty[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }


  // create a new run with the currently selected properties
  compute_dependencies(): void {
    const expRun: ExplanationRun = {
      _id: null,
      name: 'MUGS',
      status: null,
      type: RunType.mugs,
      planProperties: this.question.concat(this.collection),
      softGoals: this.collection,
      hardGoals: this.currentRun.hardGoals.concat(this.question),
      result: null,
      log: null,
    };

    console.log('Compute dependencies');
    console.log(expRun);

    this.plannerService.execute_mugs_run(this.currentRun, expRun);
  }

}
