import { inject, Injectable } from "@angular/core";
import { Actions, createEffect } from "@ngrx/effects";
import { catchError, filter, switchMap, tap } from "rxjs/operators";
import { of } from "rxjs";
import { loadUser, LoggedIn, LoggedOut } from "../user.actions";
import { AuthenticationService } from "../../services/authentication.service";

import { Store } from "@ngrx/store";
import { selectLoggedIn } from "../user.selector";


@Injectable()
export class LoggedInEffect{

    private store = inject(Store)

    public checkLogin$ = createEffect(() => this.store.select(selectLoggedIn).pipe(
        tap(isLoggedIn => console.log("Login Status: " + isLoggedIn)),
        switchMap((isLoggedIn) => {
            if(isLoggedIn){
                return [LoggedIn(), loadUser()];
            }
            else{
                return [LoggedOut()];
            }
        }))
    )
}