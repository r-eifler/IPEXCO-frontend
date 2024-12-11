import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import {map, tap} from 'rxjs/operators';
import {
  loadTokenLocalStorage,
  loadTokenLocalStorageFailure,
  loadTokenLocalStorageSuccess,
  registerUserSuccess,
  storeTokenLocalStorage
} from '../user.actions';

@Injectable()
export class LoadTokenEffect implements OnInitEffects{

    private actions$ = inject(Actions)

    ngrxOnInitEffects() {
        return loadTokenLocalStorage();
    }

    public loadTokenFromLocalStorage$ = createEffect(() => this.actions$.pipe(
        ofType(loadTokenLocalStorage),
        map(() => {
            const token : string | null = localStorage.getItem('jwt-token');
            console.log(token);
            if(token === null || token === undefined ) {
                return loadTokenLocalStorageFailure();
            }
            else{
                return loadTokenLocalStorageSuccess({token});
            }
        }
    )))

}
