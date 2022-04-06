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

interface SelectedInitUpdates {
  name: string;
  updates: {possibleValues: MetaFact[]; selected: MetaFact, orgFact: MetaFact}[];
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
              let updatesList = {name: updateSpace.name, updates: []};

              for(let possibleUpdates of updateSpace.possibleInitFactUpdates){

                let matchingInitUpdates = step.task.initUpdates.filter(f => factEquals(f.orgFact, possibleUpdates.orgFact.fact))

                let list : {possibleValues: MetaFact[]; selected: MetaFact, orgFact: MetaFact} = {possibleValues: [], selected: null, orgFact: possibleUpdates.orgFact};
                list.possibleValues.push(possibleUpdates.orgFact)
                possibleUpdates.updates.forEach(up => list.possibleValues.push(up))

                if(matchingInitUpdates.length == 1){
                  console.log(matchingInitUpdates[0]);
                  possibleUpdates.updates.forEach(up => {
                    if (factEquals(matchingInitUpdates[0].newFact, up.fact)) {
                      list.selected = up
                    }
                  });
                }
                else{
                  list.selected = possibleUpdates.orgFact
                }
                updatesList.updates.push(list);
              }
              selectedUpdates.push(updatesList);
            }
            console.log(selectedUpdates);
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
