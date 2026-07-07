import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { concatLatestFrom } from "@ngrx/operators";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import { PlanPilotService } from "../../service/planpilot.service";
import {
  selectPlanPilotFacet,
  selectPlanPilotFacetFailure,
  selectPlanPilotFacetSuccess,
  startPlanPilotSession,
  startPlanPilotSessionFailure,
  startPlanPilotSessionSuccess,
} from "../planpilot.actions";
import { selectRunId } from "../planpilot.feature";

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
}
