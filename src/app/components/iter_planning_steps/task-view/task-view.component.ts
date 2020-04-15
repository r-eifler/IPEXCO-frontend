import { Component, OnInit, Input } from '@angular/core';
import {Project} from '../../../_interface/project';
import {Goal} from '../../../_interface/goal';
import {CurrentRunService} from '../../../_service/general-services';
import {CurrentRunStore} from '../../../store/stores.store';
import {PlanRun} from '../../../_interface/run';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.css']
})
export class TaskViewComponent implements OnInit {

  currentRun$: BehaviorSubject<PlanRun>;
  hardGoals: Goal[] = [];

  constructor(private  currentRunStore: CurrentRunStore) {
    this.currentRun$ = this.currentRunStore.item$;
    this.currentRun$.subscribe(value => {
      if (value != null) {
        this.hardGoals = value.hardGoals;
      }
    });
  }

  ngOnInit(): void {
  }


}
