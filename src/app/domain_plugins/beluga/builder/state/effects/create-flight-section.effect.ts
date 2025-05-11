import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { concatLatestFrom } from "@ngrx/operators";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import { filterListNotNullOrUndefined } from "src/app/shared/common/check_null_undefined";
import { deriveSuccessor } from "../../../flight-section-planning/domain/flight-section";
import { FlightPlanTreeService } from "../../services/flight-plan-tree.service";
import { selectSiteSetUp } from "../builder.selector";
import { createFlightSectionFailure, createFlightSectionSuccess, createSuccessorFlightSection } from "../builder.actions";


@Injectable()
export class CreateFlightSectionEffect{

    private actions$ = inject(Actions)
    private store = inject(Store);
    private service = inject(FlightPlanTreeService)

    public createSuccessor$ = createEffect(() => this.actions$.pipe(
        ofType(createSuccessorFlightSection),
        concatLatestFrom(() => this.store.select(selectSiteSetUp)),
        filterListNotNullOrUndefined(),
        switchMap(([{section}, task]) => {
                let sucSection = deriveSuccessor(section, task);
                if(sucSection === undefined){
                    return [createFlightSectionFailure({err: {message: "Successor section could not be derived!"}})]
                }
                return this.service.postSection$(sucSection).pipe(
                    switchMap(section => [
                        createFlightSectionSuccess({section}),
                    ]),
                    catchError((e) => of(createFlightSectionFailure({err: e})))
                )
            })
        ))
}