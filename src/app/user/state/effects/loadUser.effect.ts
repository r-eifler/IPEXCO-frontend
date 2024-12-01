import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, filter, switchMap, tap } from "rxjs/operators";
import { of } from "rxjs";
import { loadUser, loadUserFailure, loadUserSuccess } from "../user.actions";
import { AuthenticationService } from "../../services/authentication.service";


@Injectable()
export class LoadUserEffect{

    private actions$ = inject(Actions)
    private service = inject(AuthenticationService)

    public loadUser$ = createEffect(() => this.actions$.pipe(
        ofType(loadUser),
        switchMap(() => this.service.loadUser().pipe(
            switchMap(user => [loadUserSuccess({user})]),
            catchError(() => of(loadUserFailure()))
        ))
    ))
}