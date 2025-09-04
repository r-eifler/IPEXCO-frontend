import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import { PolicyTestingTestCollectionsService } from "../../services/tests.service";
import { loadTestCollections, resetTestCollection, resetTestCollectionFailure, resetTestCollectionSuccess } from "../policy-testing.actions";
@Injectable()
export class ResetTestCollectionEffect{

    private actions$ = inject(Actions)
    private service = inject(PolicyTestingTestCollectionsService)

    public load$ = createEffect(() => this.actions$.pipe(
        ofType(resetTestCollection),
        switchMap(({suiteId}) => this.service.resetTestSuite$(suiteId).pipe(
            switchMap(testCollection => [
                resetTestCollectionSuccess({testCollection}),
                loadTestCollections({projectId: testCollection.project})
            ]),
            catchError((e) => of(resetTestCollectionFailure({err: e})))
        ))
    ))
}