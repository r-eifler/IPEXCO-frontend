import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { tap } from "rxjs/operators";
import { deleteServiceFailure } from "../globalSpec.actions";


@Injectable()
export class FailureEffect{

    private actions$ = inject(Actions)

    public fail$ = createEffect(() => this.actions$.pipe(
        ofType(deleteServiceFailure),
        tap(console.error)
    ), {dispatch: false});

}