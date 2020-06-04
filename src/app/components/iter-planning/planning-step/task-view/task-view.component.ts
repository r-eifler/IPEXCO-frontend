import { DisplayTaskService } from '../../../../service/display-task.service';
import { Component, OnInit } from '@angular/core';
import {CurrentRunStore } from '../../../../store/stores.store';
import { combineLatest } from 'rxjs';


@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.css']
})
export class TaskViewComponent implements OnInit {

  satFacts: string[] = [];

  constructor(
    private  currentRunStore: CurrentRunStore,
    private dislplayTaskService: DisplayTaskService
  ) {

    combineLatest([this.currentRunStore.item$, this.dislplayTaskService.getSelectedObject()]).subscribe(([run, displayTask]) => {
      if (run && displayTask) {
        this.satFacts = [];
        for (const fact of run.hardGoals) {
          this.satFacts.push(displayTask.getGoalDescription(fact));
        }
      }
    });

  }

  ngOnInit(): void {
  }


}
