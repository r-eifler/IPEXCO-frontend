import { PlanPropertyMapService } from "../../../../service/plan-properties/plan-property-services";
import { Component, Input, OnInit } from "@angular/core";
import { BehaviorSubject, Observable, combineLatest } from "rxjs";
import { PlanProperty } from "src/app/iterative_planning/domain/plan-property/plan-property";
import { GeneralSettings } from "src/app/interface/settings/general-settings";
import { filter, map } from "rxjs/operators";
import { IterationStep } from "src/app/iterative_planning/domain/iteration_step";
import { Store } from "@ngrx/store";
import { selectIterativePlanningProperties } from "src/app/iterative_planning/state/iterative-planning.selector";

@Component({
  selector: "app-selected-hard-goals",
  templateUrl: "./selected-hard-goals.component.html",
  styleUrls: ["./selected-hard-goals.component.scss"],
})
export class SelectedHardGoalsComponent implements OnInit {

  @Input()
  set step(step: IterationStep) {
    this.step$.next(step);
  }

  @Input()
  set settings(settings: GeneralSettings) {
    this.settings$.next(settings);
  }

  planProperties$: Observable<Record<string, PlanProperty>>;
  private step$ = new BehaviorSubject<IterationStep>(null);
  protected  settings$ = new BehaviorSubject<GeneralSettings>(null);

  hardGoals$: Observable<PlanProperty[]>;

  constructor(private store: Store) {

    this.planProperties$ = this.store.select(selectIterativePlanningProperties)

    this.hardGoals$ = combineLatest([this.step$, this.planProperties$]).pipe(
      filter(([step, planProperties]) => !!step && !!planProperties),
      map(([step, planProperties]) =>
        step.hardGoals.map((pp_id) => planProperties[pp_id])
      ),
      filter(hardGoals => ! hardGoals.some(hg => hg === undefined)),
      map((hardGoals) => hardGoals.sort((a, b) => (a.globalHardGoal ? -1 : 0))),
  );
  }

  ngOnInit(): void {}
}
