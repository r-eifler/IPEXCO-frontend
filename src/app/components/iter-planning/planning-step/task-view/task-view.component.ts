import { PlanPropertyCollectionService } from './../../../../service/plan-property-services';
import { CurrentProjectService } from 'src/app/service/project-services';
import { takeUntil } from 'rxjs/operators';
import { PlanProperty } from './../../../../interface/plan-property';
import { DisplayTaskService } from '../../../../service/display-task.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {CurrentRunStore } from '../../../../store/stores.store';
import { combineLatest, Subject } from 'rxjs';
import { GoalType } from 'src/app/interface/goal';


@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.css']
})
export class TaskViewComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject();

  satGoalFacts: string[] = [];

  enforcedSatPlanProperties: PlanProperty[] = [];

  addSatPlanProperties: PlanProperty[] = [];

  constructor(
    private  currentRunStore: CurrentRunStore,
    private dislplayTaskService: DisplayTaskService,
    private planPropertyCollectionService: PlanPropertyCollectionService,
  ) {

    combineLatest([this.currentRunStore.item$, this.dislplayTaskService.getSelectedObject(), planPropertyCollectionService.getList()])
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(([run, displayTask, planProperties]) => {
      if (run && displayTask && planProperties) {
        this.satGoalFacts = [];
        this.enforcedSatPlanProperties = [];
        for (const fact of run.hardGoals) {
          if (fact.goalType === GoalType.goalFact){
            this.satGoalFacts.push(displayTask.getGoalDescription(fact));
          }
          if (fact.goalType === GoalType.planProperty) {
            for (const pp of run.planProperties) {
              if (fact.name === pp.name) {
                this.enforcedSatPlanProperties.push(pp);
              }
            }
          }
        }
        this.addSatPlanProperties = [];
        for (const addSatProp of run.satPlanProperties) {
          this.addSatPlanProperties.push(planProperties.find(p => p.name === addSatProp));
        }
      }
    });

  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
