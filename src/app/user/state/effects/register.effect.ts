import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, switchMap, tap } from "rxjs/operators";
import { of } from "rxjs";
import {
  login,
  loginFailure,
  loginSuccess,
  registerUser,
  registerUserFailure,
  registerUserSuccess,
  storeTokenLocalStorage
} from '../user.actions';
import { AuthenticationService } from "../../services/authentication.service";

@Injectable()
export class RegisterEffect{

    private actions$ = inject(Actions)
    private service = inject(AuthenticationService)

    public loginUser$ = createEffect(() => this.actions$.pipe(
        ofType(registerUser),
        switchMap(({name, password}) => this.service.register(name, password).pipe(
            switchMap(({user, token}) => [registerUserSuccess({user, token}), storeTokenLocalStorage({token})]),
            catchError(() => of(registerUserFailure()))
        ))
    ))
}
