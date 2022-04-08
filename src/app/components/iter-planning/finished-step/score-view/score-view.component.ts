import { getMaxRelaxationCost, PlanningTaskRelaxationSpace } from 'src/app/interface/planning-task-relaxation';
import { PlanningTaskRelaxationService } from 'src/app/service/planning-task/planning-task-relaxations-services';
import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { getMaximalPlanValue, PlanProperty } from 'src/app/interface/plan-property/plan-property';
import { computePlanValue, computeRelaxationCost, IterationStep, StepStatus } from 'src/app/interface/run';
import { PlanPropertyMapService } from 'src/app/service/plan-properties/plan-property-services';

@Component({
  selector: 'app-score-view',
  templateUrl: './score-view.component.html',
  styleUrls: ['./score-view.component.scss']
})
export class ScoreViewComponent implements OnInit {

  @Input()
  set step(step : IterationStep){
    this.step$.next(step);
  }

  private step$ = new BehaviorSubject<IterationStep>(null);
  private planProperties$: BehaviorSubject<Map<string,PlanProperty>>;
  private relaxationSpaces$: BehaviorSubject<PlanningTaskRelaxationSpace[]>

  isSolvable$: Observable<boolean>;

  planValue$: Observable<number>;
  maxPlanValue$: Observable<number>;
  relqaxationCost$: Observable<number>;
  maxRelqaxationCost$: Observable<number>;
  overallScore$: Observable<number>;

  constructor(
    private planPropertiesMapService: PlanPropertyMapService,
    private planningTaskRelaxationService: PlanningTaskRelaxationService
  ) {
    this.planProperties$ = planPropertiesMapService.getMap();
    this.relaxationSpaces$ = planningTaskRelaxationService.getList();

    this.isSolvable$ = this.step$.pipe(
      filter(step => !!step),
      map(step => step.status == StepStatus.solvable)
    )

    this.planValue$ = combineLatest([this.step$, this.planProperties$]).pipe(
      filter(([step, planProperties]) => !!step && !! planProperties && planProperties.size > 0),
      map(([step, planProperties]) => computePlanValue(step, planProperties))
    );

    this.maxPlanValue$ = this.planProperties$.pipe(
      filter(planProperties => !!planProperties && planProperties.size > 0),
      map(planProperties => getMaximalPlanValue(planProperties))
    )

    this.relqaxationCost$ = combineLatest([this.step$, this.relaxationSpaces$]).pipe(
      filter(([step, spaces]) => !!step && !!spaces && spaces.length > 0),
      map(([step, spaces]) => - computeRelaxationCost(step, spaces))
    );

    this.maxRelqaxationCost$ = this.relaxationSpaces$.pipe(
      filter(spaces => !!spaces && spaces.length > 0),
      map(spaces => - getMaxRelaxationCost(spaces))
    )

    this.overallScore$ = combineLatest([this.planValue$, this.relqaxationCost$]).pipe(
      map(([planValue, relaxationCost]) => relaxationCost + planValue)
    )
  }

  ngOnInit(): void {
  }

}
