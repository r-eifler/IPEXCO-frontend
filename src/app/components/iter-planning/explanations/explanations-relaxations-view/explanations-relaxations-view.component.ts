import { filter, map, tap } from 'rxjs/operators';
import { PlanningTaskRelaxationService } from './../../../../service/planning-task/planning-task-relaxations-services';
import { MetaFact, PlanningTaskRelaxationSpace } from './../../../../interface/planning-task-relaxation';
import { PPConflict } from './../../../../interface/explanations';
import { DepExplanationRun, getRelaxationExplanationsFromStep, IterationStep } from 'src/app/interface/run';
import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';

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

  relaxations$ : Observable<{name: string, possibleValues: MetaFact[], selected: MetaFact}[]>;
  relaxationSpaces$ : BehaviorSubject<PlanningTaskRelaxationSpace[]>;

  constructor(
    private relaxationSpacesService : PlanningTaskRelaxationService
  ) {

    this.relaxationSpaces$ = relaxationSpacesService.getList();

    this.relaxations$ = combineLatest([this.step$, this.conflict$, this.relaxationSpaces$]).pipe(
      filter(([step, conflict, spaces]) => !!step && !!conflict && !!spaces),
      tap(([step, conflict, spaces]) => console.log(conflict)),
      map(([step, conflict, spaces]) =>
        spaces.map(space => (
          {
            name: space.name,
            possibleValues: [space.possibleInitFactUpdates[0].orgFact, ...space.possibleInitFactUpdates[0].updates],
            selected: getRelaxationExplanationsFromStep(step, conflict, space)[0]
          }))
      ),
      tap(a =>  console.log(a))
    );
  }

  ngOnInit(): void {
  }

}
