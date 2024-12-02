import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, switchMap, tap } from "rxjs/operators";
import { of } from "rxjs";
import { login, loginFailure, loginSuccess } from "../user.actions";
import { AuthenticationService } from "../../services/authentication.service";

@Injectable()
export class LoginEffect{

    private actions$ = inject(Actions)
    private service = inject(AuthenticationService)

    public loginUser$ = createEffect(() => this.actions$.pipe(
        ofType(login),
        switchMap(({name, password}) => this.service.login(name, password).pipe(
            switchMap(({user, token}) => [loginSuccess({user, token})]),
            catchError(() => of(loginFailure()))
        ))
    ))

    public updateUserToken$ = createEffect(() => this.actions$.pipe(
        ofType(loginSuccess),
        tap(({token}) => localStorage.setItem("jwt-token", token))
    ), {dispatch: false})

}