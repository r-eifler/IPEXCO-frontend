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
  selector: "app-goals-list",
  templateUrl: "./goals-list.component.html",
  styleUrls: ["./goals-list.component.scss"],
})
export class SelectedHardGoalsComponent implements OnInit {

  @Input()
  set heading(h: string) {
    this.headingText = h;
  }

  @Input()
  set goalIds(goalIds: string[]) {
    this.goalIds$.next(goalIds);
  }

  @Input()
  set settings(settings: GeneralSettings) {
    this.settings$.next(settings);
  }

  planProperties$: Observable<Record<string, PlanProperty>>;
  private goalIds$ = new BehaviorSubject<string[]>([]);
  protected  settings$ = new BehaviorSubject<GeneralSettings>(null);

  headingText: string
  goals$: Observable<PlanProperty[]>;

  constructor(private store: Store) {

    this.planProperties$ = this.store.select(selectIterativePlanningProperties)

    this.goals$ = combineLatest([this.goalIds$, this.planProperties$]).pipe(
      filter(([goalIds, planProperties]) => !!goalIds && !!planProperties),
      map(([goalIds, planProperties]) =>
        goalIds.map((pp_id) => planProperties[pp_id])
      ),
      filter(goals => ! goals.some(hg => hg === undefined)),
      map((goals) => goals.sort((a, b) => (a.globalHardGoal ? -1 : 0))),
  );
  }

  ngOnInit(): void {}
}
