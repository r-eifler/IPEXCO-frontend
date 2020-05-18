import { DomainSpecStore } from './../../../store/stores.store';
import { Component, OnInit, Input } from '@angular/core';
import {Project} from '../../../interface/project';
import {Goal} from '../../../interface/goal';
import {CurrentRunService} from '../../../service/run-services';
import {CurrentRunStore, TasktSchemaStore} from '../../../store/stores.store';
import {PlanRun} from '../../../interface/run';
import { BehaviorSubject, combineLatest } from 'rxjs';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.css']
})
export class TaskViewComponent implements OnInit {

  satFacts: string[] = [];

  constructor(
    private  currentRunStore: CurrentRunStore,
    private domainSepStore: DomainSpecStore
  ) {

    combineLatest([this.currentRunStore.item$, this.domainSepStore.item$]).subscribe(([run, domainSpec]) => {
      if (run && domainSpec) {
        this.satFacts = [];
        for (const fact of run.hardGoals) {
          this.satFacts.push(domainSpec.getGoalDescription(fact));
        }
      }
    });

  }

  ngOnInit(): void {
  }


}
