import { inject, Injectable } from '@angular/core';
import { createEffect } from '@ngrx/effects';
import { switchMap, tap } from 'rxjs/operators';
import { loadUser, LoggedIn, LoggedOut } from '../user.actions';

import { Store } from '@ngrx/store';
import { selectLoggedIn } from '../user.selector';


@Injectable()
export class LoggedInEffect{

    private store = inject(Store)

    public checkLogin$ = createEffect(() => this.store.select(selectLoggedIn).pipe(
        tap(isLoggedIn => console.log('Login Status: ' + isLoggedIn)),
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
