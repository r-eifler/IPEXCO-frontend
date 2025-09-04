import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import { PolicyTestingTestCollectionsService } from "../../services/tests.service";
import { createTestCollections, createTestCollectionsFailure, createTestCollectionsSuccess, loadTestCollections } from "../policy-testing.actions";
@Injectable()
export class CreateTestCollectionEffect{

    private actions$ = inject(Actions)
    private service = inject(PolicyTestingTestCollectionsService)

    public create$ = createEffect(() => this.actions$.pipe(
        ofType(createTestCollections),
        switchMap(({testCollection}) => this.service.postTestCollection$(testCollection).pipe(
            switchMap(testCollection => [
                createTestCollectionsSuccess({testCollection}),
                loadTestCollections({projectId: testCollection.project})
            ]),
            catchError((e) => of(createTestCollectionsFailure({err: e})))
        ))
    ))
}