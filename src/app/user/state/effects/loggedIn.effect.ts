import { inject, Injectable } from '@angular/core';
import { createEffect } from '@ngrx/effects';
import { filter, switchMap, tap } from 'rxjs/operators';
import { loadUser, LoggedIn, LoggedOut } from '../user.actions';
import { Store } from '@ngrx/store';
import { selectLoggedIn, selectLoggedInAndUserNotLoaded } from '../user.selector';



@Injectable()
export class LoggedInEffect{

    private store = inject(Store)

    public checkLogin$ = createEffect(() => this.store.select(selectLoggedIn).pipe(
        tap(isLoggedIn => console.log('Login Status: ' + isLoggedIn)),
        switchMap((isLoggedIn) => {
            if(isLoggedIn){
                return [LoggedIn()];
            }
            else{
                return [LoggedOut()];
            }
        }))
    )

    public checkUserLoad$ = createEffect(() => this.store.select(selectLoggedInAndUserNotLoaded).pipe(
        filter(isLoggedInAndNoUser => isLoggedInAndNoUser),
        switchMap((_) => [loadUser()]))
    )
}
