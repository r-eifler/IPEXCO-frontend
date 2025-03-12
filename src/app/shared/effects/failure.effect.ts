import { inject, Injectable } from "@angular/core";
import { Actions, createEffect } from "@ngrx/effects";
import { tap } from "rxjs";
import { ofTypeFailure } from "src/app/shared/common/pipe/ofType_failure";


@Injectable()
export class FailureEffect{

    private actions$ = inject(Actions)

    public fail$ = createEffect(() => this.actions$.pipe(
        ofTypeFailure(),
        tap(console.error)
    ), {dispatch: false});

}