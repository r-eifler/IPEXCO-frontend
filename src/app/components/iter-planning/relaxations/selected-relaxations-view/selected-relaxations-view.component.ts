import { MetaFact } from './../../../../interface/planning-task-relaxation';
import { ModifiedPlanningTask, PlanningTaskRelaxationSpace } from '../../../../interface/planning-task-relaxation';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { IterationStep } from 'src/app/interface/run';
import { SelectedIterationStepService } from 'src/app/service/planner-runs/selected-iteration-step.service';
import { PlanningTaskRelaxationService } from 'src/app/service/planning-task/planning-task-relaxations-services';
import { Fact, factEquals } from 'src/app/interface/plannig-task';

interface Dimension {
  name: string,
  possibleValues: MetaFact[];
  selected: MetaFact
}


interface SelectedInitUpdates {
  name: string;
  dimensions: Dimension[];
}

@Component({
  selector: 'app-selected-relaxations-view',
  templateUrl: './selected-relaxations-view.component.html',
  styleUrls: ['./selected-relaxations-view.component.scss']
})
export class SelectedRelaxationsViewComponent implements OnInit, OnDestroy {

  @Input()
  set step(step : IterationStep){
    this.step$.next(step);
  }

  private unsubscribe$: Subject<any> = new Subject();


  relaxationSpaces$: Observable<PlanningTaskRelaxationSpace[]>;
  selectedUpdates$: Observable<SelectedInitUpdates[]>;
  private step$ = new BehaviorSubject<IterationStep>(null);

  constructor(
    private relaxationService: PlanningTaskRelaxationService
  ) {

    this.relaxationSpaces$ = relaxationService.getList();


    this.selectedUpdates$ = combineLatest([this.step$, this.relaxationSpaces$]).pipe(
      map(([step, updatesSpace]) => {
          if(step && updatesSpace) {
            let selectedUpdates = [];
            for(let updateSpace of updatesSpace){
              let updatesList = {name: updateSpace.name, dimensions: []};

              for(let dim of updateSpace.dimensions){

                let matchingInitUpdates = step.task.initUpdates.filter(f => factEquals(f.orgFact, dim.orgFact.fact))

                let list : Dimension = {name: dim.name, possibleValues: [], selected: null};
                list.possibleValues.push(dim.orgFact)
                dim.updates.forEach(up => list.possibleValues.push(up))

                if(matchingInitUpdates.length == 1){
                  dim.updates.forEach(up => {
                    if (factEquals(matchingInitUpdates[0].newFact, up.fact)) {
                      list.selected = up
                    }
                  });
                }
                else{
                  list.selected = dim.orgFact
                }
                updatesList.dimensions.push(list);
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

  formatLabel(metaFact: MetaFact) {
    return metaFact.display;
  }
}

