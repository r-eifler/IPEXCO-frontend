import {Component, Input, OnInit} from '@angular/core';
import {PlanProperty} from '../../../_interface/plan-property';
import {Project} from '../../../_interface/project';
import {Run} from '../../../_interface/run';
import {PlannerService} from '../../../_service/planner.service';
import {PlanPropertyCollectionService} from '../../../_service/general-services';
import {BehaviorSubject} from 'rxjs';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-task-creator',
  templateUrl: './task-creator.component.html',
  styleUrls: ['./task-creator.component.css']
})
export class TaskCreatorComponent implements OnInit {

  @Input() hardProperties: PlanProperty[] = [];
  @Input() project: Project;
  properties$: BehaviorSubject<PlanProperty[]>;

  constructor(
    private plannerService: PlannerService,
    private propertiesService: PlanPropertyCollectionService,
  ) {
    this.properties$ = this.propertiesService.collection$;
  }

  ngOnInit(): void {
    this.propertiesService.findCollection();
  }

  drop(event: CdkDragDrop<string[]>) {
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
    const run: Run = {
      _id: null,
      name: 'compute plan',
      status: null,
      project: this.project,
      soft_properties: [],
      hard_properties: this.hardProperties,
      result: null,
      log: null,
    };

    console.log('Compute dependencies');
    console.log(run);

    this.plannerService.compute_plan(run);
  }
}
