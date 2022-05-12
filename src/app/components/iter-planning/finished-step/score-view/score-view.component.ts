import { ExecutionSettingsServiceService } from './../../../../service/settings/ExecutionSettingsService.service';
import { ExecutionSettings } from 'src/app/interface/settings/execution-settings';
import {
  getMaxRelaxationCost,
  PlanningTaskRelaxationSpace,
} from "src/app/interface/planning-task-relaxation";
import { PlanningTaskRelaxationService } from "src/app/service/planning-task/planning-task-relaxations-services";
import { Component, Input, OnInit } from "@angular/core";
import { BehaviorSubject, Observable, combineLatest } from "rxjs";
import { filter, map } from "rxjs/operators";
import {
  getMaximalPlanValue,
  PlanProperty,
} from "src/app/interface/plan-property/plan-property";
import {
  computePlanValue,
  computeRelaxationCost,
  IterationStep,
  StepStatus,
} from "src/app/interface/run";
import { PlanPropertyMapService } from "src/app/service/plan-properties/plan-property-services";

@Component({
  selector: "app-score-view",
  templateUrl: "./score-view.component.html",
  styleUrls: ["./score-view.component.scss"],
})
export class ScoreViewComponent implements OnInit {
  @Input()
  set step(step: IterationStep) {
    this.step$.next(step);
  }

  private step$ = new BehaviorSubject<IterationStep>(null);
  private planProperties$: BehaviorSubject<Map<string, PlanProperty>>;
  private relaxationSpaces$: BehaviorSubject<PlanningTaskRelaxationSpace[]>;

  isSolvable$: Observable<boolean>;
  isUnSolvable$: Observable<boolean>;

  planValue$: Observable<number>;
  maxPlanValue$: Observable<number>;
  relqaxationCost$: Observable<number>;
  maxRelqaxationCost$: Observable<number>;
  overallScore$: Observable<number>;

  settings$: Observable<ExecutionSettings>;

  constructor(
    private planPropertiesMapService: PlanPropertyMapService,
    private planningTaskRelaxationService: PlanningTaskRelaxationService,
    private settingsService: ExecutionSettingsServiceService,
  ) {
    this.planProperties$ = planPropertiesMapService.getMap();
    this.relaxationSpaces$ = planningTaskRelaxationService.getList();

    this.isSolvable$ = this.step$.pipe(
      filter((step) => !!step),
      map((step) => step.status == StepStatus.solvable)
    );

    this.isUnSolvable$ = this.step$.pipe(
      filter((step) => !!step),
      map((step) => step.status == StepStatus.unsolvable)
    );

    this.planValue$ = combineLatest([this.step$, this.planProperties$]).pipe(
      map(([step, planProperties]) => {
        if (!!step && !!planProperties && planProperties.size > 0) {
          return computePlanValue(step, planProperties);
        } else {
          return 0;
        }
      })
    );

    this.maxPlanValue$ = this.planProperties$.pipe(
      map((planProperties) => {
        if (!!planProperties && planProperties.size > 0) {
          return getMaximalPlanValue(planProperties);
        } else {
          return 0;
        }
      })
    );

    this.relqaxationCost$ = combineLatest([
      this.step$,
      this.relaxationSpaces$,
    ]).pipe(
      map(([step, spaces]) => {
        if (!!step && !!spaces && spaces.length > 0) {
          return -computeRelaxationCost(step, spaces);
        } else {
          return 0;
        }
      })
    );

    this.maxRelqaxationCost$ = this.relaxationSpaces$.pipe(
      map((spaces) => {
        if (!!spaces && spaces.length > 0) {
          return -getMaxRelaxationCost(spaces);
        } else {
          return 0;
        }
      })
    );

    this.overallScore$ = combineLatest([
      this.planValue$,
      this.relqaxationCost$,
    ]).pipe(map(([planValue, relaxationCost]) => relaxationCost + planValue));

    this.settings$ = this.settingsService.getSelectedObject();
  }

  ngOnInit(): void {}
}
