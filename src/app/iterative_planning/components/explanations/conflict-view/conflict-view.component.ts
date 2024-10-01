import { PlanPropertyMapService } from "../../../../service/plan-properties/plan-property-services";
import { BehaviorSubject, Observable, combineLatest } from "rxjs";
import { PlanProperty } from "../../../domain/plan-property/plan-property";
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { map, tap, filter, take } from "rxjs/operators";
import { CurrentProjectService } from "src/app/service/project/project-services";
import { LogEvent, TimeLoggerService } from "src/app/service/logger/time-logger.service";
import { GeneralSettings } from "src/app/interface/settings/general-settings";
import { RunStatus } from "src/app/iterative_planning/domain/run";
import { Store } from "@ngrx/store";
import { selectIterativePlanningProject, selectIterativePlanningProperties } from "src/app/iterative_planning/state/iterative-planning.selector";

@Component({
  selector: "app-conflict-view",
  templateUrl: "./conflict-view.component.html",
  styleUrls: ["./conflict-view.component.scss"],
})
export class ConflictViewComponent implements OnInit, OnDestroy {
  runStatus = RunStatus;

  @Input()
  set solvable(b: boolean) {
    this.selectedConflictIndex = null;
    this.solvable$.next(b);
  }
  @Input()
  set question(question: PlanProperty) {
    this.selectedConflictIndex = null;
    this.question$.next(question);
  }
  @Input()
  set explanation(explanation: any) {
    console.log(explanation);
    this.selectedConflictIndex = null;
    this.explanation$.next(explanation);
  }

  @Output() selectedConflict = new EventEmitter<any>();

  explanation$ = new BehaviorSubject<any>(null);
  question$ = new BehaviorSubject<PlanProperty>(null);
  solvable$ = new BehaviorSubject<boolean>(null);

  dependencies$: Observable<PlanProperty[][]>;
  planProperties$: Observable<Record<string, PlanProperty>>;
  solvableAtAll$: Observable<boolean>;
  provideRelaxationExplanations$: Observable<boolean>;
  settings$: Observable<GeneralSettings>;

  selectedConflictIndex: number = null;

  constructor(
    private store: Store,
    private timeLogger: TimeLoggerService,
  ) {
    this.planProperties$ = this.store.select(selectIterativePlanningProperties);

    this.settings$ = this.store.select(selectIterativePlanningProject).pipe(
      map(p => p?.settings)
    );

    this.dependencies$ = combineLatest([
      this.explanation$,
      this.planProperties$,
    ]).pipe(
      filter(([exp, planProperties]) => !!exp && !!planProperties),
      map(([exp, planProperties]) =>
        exp.conflicts.map((con) => con.elems.map((e) => planProperties[e]))
      )
    );

    this.solvableAtAll$ = this.dependencies$.pipe(
      map((dep) => dep.filter((c) => c.length == 0).length == 0)
    );
  }

  ngOnDestroy(): void {
    this.timeLogger.log(LogEvent.END_CHECK_CONFLICT_EXPLANATION);
  }

  ngOnInit(): void {
    this.timeLogger.log(LogEvent.START_CHECK_CONFLICT_EXPLANATION);
  }

  selectConflict(c: PlanProperty[], index: number) {
    this.selectedConflictIndex = index;
    this.question$
      .pipe(take(1))
      .subscribe((question) =>
        this.selectedConflict.emit({
          elems: [question._id, ...c.map((pp) => pp._id)],
        })
      );
  }

  selectPreferenceUnsolvable(index: number) {
    this.selectedConflictIndex = index;
    this.question$
      .pipe(take(1))
      .subscribe((question) =>
        this.selectedConflict.emit({ elems: [question._id] })
      );
  }

  selectConflictStepUnsolvable(c: PlanProperty[], index: number) {
    this.selectedConflictIndex = index;
    this.selectedConflict.emit({ elems: c.map((pp) => pp._id) });
  }
}
