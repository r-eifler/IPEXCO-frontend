import { filter, find, flatMap, map, tap } from 'rxjs/operators';
import { PlanningTaskRelaxationService } from './../../../../service/planning-task/planning-task-relaxations-services';
import { MetaFact, PlanningTaskRelaxationSpace } from './../../../../interface/planning-task-relaxation';
import { PPConflict } from './../../../../interface/explanations';
import { DepExplanationRun, getRelaxationExplanationsFromStep, IterationStep } from 'src/app/interface/run';
import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { Fact, factEquals } from 'src/app/interface/plannig-task';

@Component({
  selector: 'app-explanations-relaxations-view',
  templateUrl: './explanations-relaxations-view.component.html',
  styleUrls: ['./explanations-relaxations-view.component.scss']
})
export class ExplanationsRelaxationsViewComponent implements OnInit {

  @Input()
  set step(step : IterationStep){
    this.step$.next(step);
  }

  @Input()
  set conflict(c : PPConflict){
    this.conflict$.next(c);
  }

  private step$ = new BehaviorSubject<IterationStep>(null);
  private conflict$ = new BehaviorSubject<PPConflict>(null);

  relaxations$ : Observable<{name: string, dimensions: {possibleValues: MetaFact[], selected: MetaFact}[]}[]>;
  relaxationSpaces$ : BehaviorSubject<PlanningTaskRelaxationSpace[]>;

  constructor(
    private relaxationSpacesService : PlanningTaskRelaxationService
  ) {

    this.relaxationSpaces$ = relaxationSpacesService.getList();

    this.relaxations$ = combineLatest([this.step$, this.conflict$, this.relaxationSpaces$]).pipe(
      filter(([step, conflict, spaces]) => !!step && !!conflict && !!spaces),
      tap(([step, conflict, spaces]) => console.log(conflict)),
      flatMap(([step, conflict, spaces]) =>
        spaces.map(space => {
          let relaxations: {name: string, dimensions: {possibleValues: MetaFact[], selected: MetaFact}[]}[] = []
          let nodes = getRelaxationExplanationsFromStep(step, conflict, space);
          for (let node of nodes){
            let dimensions: {possibleValues: MetaFact[], selected: MetaFact}[] = [];
            let d_index = 0;
            for(let demension of space.dimensions) {
              let values = [demension.orgFact, ...demension.updates]
              dimensions.push({
                  possibleValues: values,
                  selected: values.find(mf => factEquals(mf.fact, node.updates[d_index]))
                });
                d_index++;
            }
            relaxations.push({name: space.name, dimensions});
          }
          return relaxations;
        })
      ),
      tap(a =>  console.log(a))
    );
  }

  ngOnInit(): void {
  }

}
