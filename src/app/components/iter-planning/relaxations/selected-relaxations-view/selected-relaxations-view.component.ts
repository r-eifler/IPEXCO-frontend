import { InitFactUpdate } from './../../../../interface/planning-task-relaxation';
import { ModifiedPlanningTask, PlanningTaskRelaxationSpace } from '../../../../interface/planning-task-relaxation';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { IterationStep } from 'src/app/interface/run';
import { SelectedIterationStepService } from 'src/app/service/planner-runs/selected-iteration-step.service';
import { PlanningTaskRelaxationService } from 'src/app/service/planning-task/planning-task-relaxations-services';
import { Fact } from 'src/app/interface/plannig-task';

interface SelectedInitUpdate {
  name: string;
  updates: {fact: Fact; selected: boolean}[][];
}

@Component({
  selector: 'app-selected-relaxations-view',
  templateUrl: './selected-relaxations-view.component.html',
  styleUrls: ['./selected-relaxations-view.component.scss']
})
export class SelectedRelaxationsViewComponent implements OnInit, OnDestroy {

  @Input() step : IterationStep;

  private unsubscribe$: Subject<any> = new Subject();

  relaxationSpaces$: Observable<PlanningTaskRelaxationSpace[]>;
  selectedUpdates$: Observable<SelectedInitUpdate[]>;

  constructor(
    private relaxationService: PlanningTaskRelaxationService
  ) {

    this.relaxationSpaces$ = relaxationService.getList();


    this.selectedUpdates$ = this.relaxationSpaces$.pipe(
      map((updatesSpace) => {
          if(updatesSpace) {
            let selectedUpdates = [];
            for(let updateSpace of updatesSpace){
              let updatesList = {name: updateSpace.name, updates: []};

              for(let possibleUpdates of updateSpace.possibleInitFactUpdates){

                let matchingInitUpdates = this.step.task.initUpdates.filter(f => f.orgFact.equals(possibleUpdates.orgFact))

                let list : {fact: Fact; selected: boolean}[] = [];

                if(matchingInitUpdates.length == 1){
                  list.push({fact: possibleUpdates.orgFact, selected: false});
                  possibleUpdates.updates.forEach(up => list.push({fact: up.fact, selected: matchingInitUpdates[0].newFact.equals(up.fact)}))
                }
                else{
                  list.push({fact: possibleUpdates.orgFact, selected: true});
                  possibleUpdates.updates.forEach(up => list.push({fact: up.fact, selected: false}))
                }
                updatesList.updates.push(list);
              }
              selectedUpdates.push(updatesList);
            }
            return selectedUpdates;
          }
      })
    )
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
