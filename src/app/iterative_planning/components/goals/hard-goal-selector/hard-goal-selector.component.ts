import { PlanProperty } from "src/app/iterative_planning/domain/plan-property/plan-property";
import { combineLatest, Observable } from "rxjs";
import { Component, OnInit } from "@angular/core";
import { filter, map, take,} from "rxjs/operators";
import { GeneralSettings } from "src/app/interface/settings/general-settings";
import { ModIterationStep } from "src/app/iterative_planning/domain/iteration_step";
import { Store } from "@ngrx/store";
import { selectIterativePlanningNewStep, selectIterativePlanningProject, selectIterativePlanningProperties } from "src/app/iterative_planning/state/iterative-planning.selector";
import { updateNewIterationStep } from "src/app/iterative_planning/state/iterative-planning.actions";


@Component({
  selector: "app-hard-goal-selector",
  templateUrl: "./hard-goal-selector.component.html",
  styleUrls: ["./hard-goal-selector.component.css"],
})
export class HardGoalSelectorComponent implements OnInit {

  newStep$: Observable<ModIterationStep>;
  planProperties$: Observable<Record<string,PlanProperty>>;
  settings$: Observable<GeneralSettings>;


  possiblePP$: Observable<PlanProperty[]>;
  hardGoals$: Observable<PlanProperty[]>;

  constructor(
    private store: Store,
  ) {
    this.newStep$ = this.store.select(selectIterativePlanningNewStep)
    this.planProperties$ = this.store.select(selectIterativePlanningProperties)

    this.settings$ = this.store.select(selectIterativePlanningProject).pipe(
      map(p => p?.settings)
    );

    this.possiblePP$ = combineLatest([this.newStep$, this.planProperties$])
      .pipe(
        map(([step, properties]) => {
          const props = [];
          for (let property of Object.values(properties)) {
            if (property.isUsed && !step.hardGoals.includes(property._id))
              props.push(property);
          }

          return props;
        })
      );

    this.hardGoals$ = combineLatest([this.newStep$, this.planProperties$]).pipe(
      map(([step, planProperties]) =>
        step.hardGoals.map((pp_id) => planProperties[pp_id])
      ),
      map((hardGoals) => hardGoals.sort((a, b) => (a.globalHardGoal ? -1 : 0)))
    );
  }

  ngOnInit() {}


  selectPP(pp: PlanProperty) {
    this.newStep$.pipe(take(1)).subscribe((step) => {
      let updatedStep = {
        ...step,
        hardGoals: [...step.hardGoals, pp._id],
      }
      this.store.dispatch(updateNewIterationStep({iterationStep: updatedStep}))
    });
  }

  deselectPP(pp: PlanProperty) {
    this.newStep$.pipe(take(1)).subscribe((step) => {
      let updatedStep = {
        ...step,
        hardGoals: step.hardGoals.filter((hg) => hg != pp._id),
      }
      this.store.dispatch(updateNewIterationStep({iterationStep: updatedStep}))
    });
  }
}
