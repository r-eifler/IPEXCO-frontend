import { FactUpdate } from './../../../../interface/planning-task-relaxation';
import { NewIterationStepService } from './../../../../service/planner-runs/selected-iteration-step.service';
import { PlanningTaskRelaxationService } from 'src/app/service/planning-task/planning-task-relaxations-services';
import { map, filter, takeUntil, tap, take } from 'rxjs/operators';
import { ModifiedPlanningTask, PlanningTaskRelaxationSpace, MetaFact } from '../../../../interface/planning-task-relaxation';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subject, Observable, combineLatest } from 'rxjs';
import { IterationStep, ModIterationStep } from 'src/app/interface/run';
import { SelectedIterationStepService } from 'src/app/service/planner-runs/selected-iteration-step.service';
import { MatSelectChange } from '@angular/material/select';
import { Fact, factEquals } from 'src/app/interface/plannig-task';

interface Dimension {
  name: string,
  possibleValues: MetaFact[];
  selected: MetaFact,
  orgFact: MetaFact
}

interface SelectedInitUpdates {
  name: string;
  dimensions: Dimension[];
}

@Component({
  selector: 'app-relaxation-selector',
  templateUrl: './relaxation-selector.component.html',
  styleUrls: ['./relaxation-selector.component.scss']
})
export class RelaxationSelectorComponent implements OnInit, OnDestroy {

  private unsubscribe$: Subject<any> = new Subject();


  relaxationSpaces$: Observable<PlanningTaskRelaxationSpace[]>;
  selectedUpdates$: Observable<SelectedInitUpdates[]>;
  step$ : BehaviorSubject<ModIterationStep>;

  constructor(
    private relaxationService: PlanningTaskRelaxationService,
    private newIterationStepService: NewIterationStepService
  ) {

    this.relaxationSpaces$ = relaxationService.getList();

    this.step$ = newIterationStepService.getSelectedObject();

    this.selectedUpdates$ = combineLatest([this.step$, this.relaxationSpaces$]).pipe(
      map(([step, updatesSpace]) => {
          if(step && updatesSpace) {
            let selectedUpdates = [];
            for(let updateSpace of updatesSpace){
              let updatesList = {name: updateSpace.name, dimensions: []};

              for(let dim of updateSpace.dimensions){

                let matchingInitUpdates = step.task.initUpdates.filter(f => factEquals(f.orgFact, dim.orgFact.fact))

                let list : Dimension = {name: dim.name, possibleValues: [], selected: null, orgFact: dim.orgFact};
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

  newUpdateSelected(newSelected: MetaFact, oldSelected: MetaFact, orgFact: MetaFact): void {
    console.log(orgFact);
    console.log(oldSelected);
    console.log(newSelected);

    this.step$.pipe(filter(step => !!step), take(1)).subscribe(
      step => {
        step.task.initUpdates = step.task.initUpdates.filter(mt => ! factEquals(mt.orgFact, orgFact.fact));
        if(! factEquals(newSelected.fact, orgFact.fact)){
          step.task.initUpdates.push({orgFact: orgFact.fact, newFact: newSelected.fact});
        }
        this.newIterationStepService.saveObject(step);
      }
    );
  }

}
