import { PlanningTaskRelaxationService } from 'src/app/service/planning-task/planning-task-relaxations-services';
import { map, filter, takeUntil, tap } from 'rxjs/operators';
import { InitFactUpdate, ModifiedPlanningTask, PlanningTaskRelaxationSpace, PossibleInitFactUpdate } from '../../../../interface/planning-task-relaxation';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subject, Observable, combineLatest } from 'rxjs';
import { IterationStep, ModIterationStep } from 'src/app/interface/run';
import { SelectedIterationStepService } from 'src/app/service/planner-runs/selected-iteration-step.service';
import { MatSelectChange } from '@angular/material/select';
import { Fact } from 'src/app/interface/plannig-task';

@Component({
  selector: 'app-relaxation-selector',
  templateUrl: './relaxation-selector.component.html',
  styleUrls: ['./relaxation-selector.component.scss']
})
export class RelaxationSelectorComponent implements OnInit, OnDestroy {

  private unsubscribe$: Subject<any> = new Subject();

  step$: BehaviorSubject<IterationStep>;
  task$: Observable<ModifiedPlanningTask>;
  relaxationSpaces$: Observable<PlanningTaskRelaxationSpace[]>;

  selectedUpdates: {fact: Fact, value: number}[][] = [];

  constructor(
    private selectedIterationStepService: SelectedIterationStepService,
    private relaxationService: PlanningTaskRelaxationService
  ) {

    this.step$ = selectedIterationStepService.findSelectedObject();

    this.task$ = this.step$.pipe(
      filter(step => !!step),
      map(step => step.task)
    ).pipe(takeUntil(this.unsubscribe$));

    this.relaxationSpaces$ = relaxationService.getList();

    combineLatest([this.task$, this.relaxationSpaces$]).
      pipe(takeUntil(this.unsubscribe$)).
      subscribe(([task, updatesSpace]) => {
          if(task && updatesSpace) {
            this.selectedUpdates = [];
            for(let updateSpace of updatesSpace){
              this.selectedUpdates.push([]);
              for(let possibleUpdates of updateSpace.possibleInitFactUpdates){
                let matchingInitUpdates = task.initUpdates.filter(f => f.orgFact.equals(possibleUpdates.orgFact))
                if(matchingInitUpdates.length == 1){
                  let usedUpdates = possibleUpdates.updates.filter(f => f.fact.equals(matchingInitUpdates[0].newFact))
                  this.selectedUpdates[this.selectedUpdates.length-1].push(usedUpdates[0])
                }
                else{
                  this.selectedUpdates[this.selectedUpdates.length-1].push(null)
                }
              }
            }
          }
      });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  updateSelected(event: MatSelectChange, possibleUpdates: PossibleInitFactUpdate): void {
      let selectedUpdate = event.value;
      let newInitUpdate : InitFactUpdate = {orgFact: possibleUpdates.orgFact, newFact: selectedUpdate.fact, value: selectedUpdate.value};
      console.log(newInitUpdate);
      let step = this.step$.getValue();
      if (step.canBeModified()) {
        step.task.initUpdates = step.task.initUpdates.filter(up => ! up.orgFact.equals(newInitUpdate.orgFact))
        step.task.initUpdates.push(newInitUpdate);
        this.selectedIterationStepService.saveObject(step);
      }
      else {
        let modStep = new ModIterationStep('Next Step', step)
        modStep.task.initUpdates = modStep.task.initUpdates.filter(up => ! up.orgFact.equals(newInitUpdate.orgFact))
        modStep.task.initUpdates.push(newInitUpdate);
        this.selectedIterationStepService.saveObject(modStep);
      }

  }

  getSelectedUpdate(i, j) {
    if(this.selectedUpdates.length > i && this.selectedUpdates[i].length > j){
      return this.selectedUpdates[i][j]
    }
    return null;
  }

}
