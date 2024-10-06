import { GeneralSettings } from '../../../../interface/settings/general-settings';
import { Subject, Observable, combineLatest } from "rxjs";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { filter, map, tap } from "rxjs/operators";
import { IterationStep } from 'src/app/iterative_planning/domain/iteration_step';
import { Store } from '@ngrx/store';
import { selectIterativePlanningProject, selectIterativePlanningProperties, selectIterativePlanningSelectedStep } from 'src/app/iterative_planning/state/iterative-planning.selector';

import { PlanRunStatus } from 'src/app/iterative_planning/domain/plan';
import { initNewIterationStep, registerPlanComputation } from 'src/app/iterative_planning/state/iterative-planning.actions';
import { PlanProperty } from 'src/app/iterative_planning/domain/plan-property/plan-property';

@Component({
  selector: "app-iteration-step-overview",
  templateUrl: "./iteration-step-overview.component.html",
  styleUrls: ["./iteration-step-overview.component.scss"],
})
export class IterationStepOverviewComponent implements OnInit {

  step$: Observable<IterationStep>;
  hasPlan$: Observable<boolean>;
  settings$: Observable<GeneralSettings>;
  hardGoals$: Observable<string[]>;

  baseGoals$: Observable<string[]>;
  satisfiedGoals$: Observable<string[]>;
  enforcedGoals$: Observable<string[]>;

  planProperties$: Observable<Record<string,PlanProperty>>;

  constructor(
    private store: Store,
  ) {

    this.settings$ = this.store.select(selectIterativePlanningProject).pipe(
      map(p => p?.settings)
    )

    this.step$ = this.store.select(selectIterativePlanningSelectedStep)
    this.planProperties$ = this.store.select(selectIterativePlanningProperties)

    this.hasPlan$ = this.step$.pipe(map(step => step?.plan?.status === PlanRunStatus.plan_found))

    this.hardGoals$ = this.step$.pipe(map(step => step?.hardGoals))

    this.baseGoals$ = this.planProperties$.pipe(
      map(pps => Object.values(pps).filter(pp => pp.isUsed && pp.globalHardGoal).map(pp => pp._id)),
      tap(ids => console.log('Global hard goals: ' + ids))
    );

    this.satisfiedGoals$ = this.step$.pipe(
      map(step => step?.plan?.satisfied_properties),
      tap(ids => console.log('Satisfied goals: ' + ids))
    );

    this.enforcedGoals$ = combineLatest([this.baseGoals$, this.hardGoals$]).pipe(
      filter(([baseGoals, hardGoals]) => !!baseGoals && !!hardGoals),
      map(([baseGoals, hardGoals]) => hardGoals.filter(hg => ! baseGoals.includes(hg))),
      tap(ids => console.log('Enforced goals: ' + ids))
    )
  }

  ngOnInit(): void {}

  computePlan() {
    console.log('Compute plan!')
    this.store.dispatch(registerPlanComputation())
  }

  createNewStep(baseStepId?: string) {
    this.store.dispatch(initNewIterationStep({baseStepId}));
  }
}
