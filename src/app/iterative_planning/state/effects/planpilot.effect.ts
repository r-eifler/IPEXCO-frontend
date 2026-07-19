import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { concatLatestFrom } from "@ngrx/operators";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import { PlanPilotQueryType } from "../../domain/planpilot";
import { PlanPilotService } from "../../service/planpilot.service";
import {
  queryPlanPilotSolutionCount,
  queryPlanPilotSolutionCountFailure,
  queryPlanPilotSolutionCountSuccess,
  queryPlanPilotSolutions,
  queryPlanPilotSolutionsFailure,
  queryPlanPilotSolutionsSuccess,
  selectPlanPilotFacet,
  selectPlanPilotFacetFailure,
  selectPlanPilotFacetSuccess,
  startPlanPilotSession,
  startPlanPilotSessionFailure,
  startPlanPilotSessionSuccess,
} from "../planpilot.actions";
import { selectRunId } from "../planpilot.feature";

// Only enumerate the concrete plans once the remaining set is small enough
// to render meaningfully. Above this, we just show the counter.
const SOLUTION_LIST_THRESHOLD = 10;

@Injectable()
export class PlanPilotEffect {

  private actions$ = inject(Actions);
  private service = inject(PlanPilotService);
  private store = inject(Store);

  public startSession$ = createEffect(() => this.actions$.pipe(
    ofType(startPlanPilotSession),
    switchMap(({ request }) => this.service.startSession$(request).pipe(
      map((response) => startPlanPilotSessionSuccess({ response })),
      catchError((err) => of(startPlanPilotSessionFailure({ err }))),
    )),
  ));

  public selectFacet$ = createEffect(() => this.actions$.pipe(
    ofType(selectPlanPilotFacet),
    concatLatestFrom(() => this.store.select(selectRunId)),
    switchMap(([{ request }, runId]) => {
      if (!runId) {
        return of(selectPlanPilotFacetFailure({ err: "No active PlanPilot session." }));
      }
      return this.service.selectFacet$(runId, request).pipe(
        map((response) => selectPlanPilotFacetSuccess({ response })),
        catchError((err) => of(selectPlanPilotFacetFailure({ err }))),
      );
    }),
  ));

  // After a session starts or a decision is committed, refresh the counter.
  public refreshSolutionCount$ = createEffect(() => this.actions$.pipe(
    ofType(startPlanPilotSessionSuccess, selectPlanPilotFacetSuccess),
    map(() => queryPlanPilotSolutionCount()),
  ));

  // Query the number of solutions still consistent with the decisions.
  public querySolutionCount$ = createEffect(() => this.actions$.pipe(
    ofType(queryPlanPilotSolutionCount),
    concatLatestFrom(() => this.store.select(selectRunId)),
    switchMap(([, runId]) => {
      if (!runId) {
        return of(queryPlanPilotSolutionCountFailure({ err: "No active PlanPilot session." }));
      }
      return this.service.query$(runId, { type: PlanPilotQueryType.SOLUTION_COUNT }).pipe(
        map((response) => queryPlanPilotSolutionCountSuccess({ count: response.result.value })),
        catchError((err) => of(queryPlanPilotSolutionCountFailure({ err }))),
      );
    }),
  ));

  // Once the remaining set is small, enumerate the concrete plans;
  // otherwise clear the list and keep showing only the counter.
  public refreshSolutions$ = createEffect(() => this.actions$.pipe(
    ofType(queryPlanPilotSolutionCountSuccess),
    map(({ count }) =>
      count !== undefined && count > 0 && count <= SOLUTION_LIST_THRESHOLD
        ? queryPlanPilotSolutions()
        : queryPlanPilotSolutionsSuccess({ solutions: [] }),
    ),
  ));

  // Enumerate the solutions (plans) still consistent with the decisions.
  public querySolutions$ = createEffect(() => this.actions$.pipe(
    ofType(queryPlanPilotSolutions),
    concatLatestFrom(() => this.store.select(selectRunId)),
    switchMap(([, runId]) => {
      if (!runId) {
        return of(queryPlanPilotSolutionsFailure({ err: "No active PlanPilot session." }));
      }
      return this.service.query$(runId, { type: PlanPilotQueryType.SOLUTION }).pipe(
        map((response) => queryPlanPilotSolutionsSuccess({ solutions: response.result.solutions ?? [] })),
        catchError((err) => of(queryPlanPilotSolutionsFailure({ err }))),
      );
    }),
  ));
}
