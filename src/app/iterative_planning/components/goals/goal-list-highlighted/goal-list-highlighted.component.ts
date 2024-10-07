import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest, filter, map, Observable, tap } from 'rxjs';
import { PlanProperty } from 'src/app/iterative_planning/domain/plan-property/plan-property';
import { selectIterativePlanningProperties } from 'src/app/iterative_planning/state/iterative-planning.selector';
import { GeneralSettings } from 'src/app/project/domain/general-settings';


interface HighlightedGoals {
  goal: PlanProperty,
  highlighted: boolean
}

@Component({
  selector: 'app-goal-list-highlighted',
  templateUrl: './goal-list-highlighted.component.html',
  styleUrl: './goal-list-highlighted.component.scss'
})
export class GoalListHighlightedComponent {

  @Input()
  set heading(h: string) {
    this.headingText = h;
  }

  @Input()
  set baseGoals(goalIds: string[]) {
    this.baseGoalsIds$.next(goalIds);
  }
  @Input()
  set goalIds(goalIds: string[]) {
    this.goalIds$.next(goalIds);
  }
  @Input()
  set highlighted(goalIds: string[]) {
    this.highlightedGoalIds$.next(goalIds);
  }

  @Input()
  set settings(settings: GeneralSettings) {
    this.settings$.next(settings);
  }

  planProperties$: Observable<Record<string, PlanProperty>>;
  private baseGoalsIds$ = new BehaviorSubject<string[]>([]);
  private goalIds$ = new BehaviorSubject<string[]>([]);
  private highlightedGoalIds$ = new BehaviorSubject<string[]>([]);
  protected  settings$ = new BehaviorSubject<GeneralSettings>(null);

  headingText: string
  goals$: Observable<HighlightedGoals[]>;
  baseGoals$: Observable<PlanProperty[]>;

  constructor(private store: Store) {

    this.planProperties$ = this.store.select(selectIterativePlanningProperties)

    this.baseGoals$ = combineLatest([this.baseGoalsIds$, this.planProperties$]).pipe(
      filter(([goalIds, planProperties]) => !!goalIds && !!planProperties),
      map(([goalIds, planProperties]) =>
        goalIds.map((pp_id) => planProperties[pp_id])
      ),
      filter(goals => ! goals.some(hg => hg === undefined)),
      map((goals) => goals.sort((a, b) => (a.globalHardGoal ? -1 : 0))),
    );

    this.goals$ = combineLatest([this.goalIds$, this.highlightedGoalIds$, this.planProperties$]).pipe(
      filter(([goalIds, highlightedIds, planProperties]) => !!goalIds && !!highlightedIds && !!planProperties),
      tap(([goalIds, highlightedIds, planProperties]) => console.log(this.goalIds)),
      map(([goalIds, highlightedIds, planProperties]) =>
        goalIds.map((pp_id) => ({goal: planProperties[pp_id], highlighted: highlightedIds.includes(pp_id)}))
      ),
      filter(goals => ! goals.some(g => g.goal === undefined)),
      map((goals) => goals.sort((a, b) => (a.goal ? -1 : 0))),
    );

  }

  ngOnInit(): void {}

}
