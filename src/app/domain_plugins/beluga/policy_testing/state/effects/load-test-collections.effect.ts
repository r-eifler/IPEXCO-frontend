import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import { PolicyTestingTestCollectionsService } from "../../services/tests.service";
import { loadTestCollections, loadTestCollectionsFailure, loadTestCollectionsSuccess } from "../policy-testing.actions";
@Injectable()
export class LoadTestCollectionsEffect{

    private actions$ = inject(Actions)
    private service = inject(PolicyTestingTestCollectionsService)

    public load$ = createEffect(() => this.actions$.pipe(
        ofType(loadTestCollections),
        switchMap(({projectId}) => this.service.getTestCollections$(projectId).pipe(
            map(testCollections => loadTestCollectionsSuccess({testCollections})),
            catchError((e) => of(loadTestCollectionsFailure({err: e})))
        ))
    ))
}