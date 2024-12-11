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
export class StoreTokenEffect{

  private actions$ = inject(Actions)

  public updateUserToken$ = createEffect(() => this.actions$.pipe(
    ofType(storeTokenLocalStorage),
    tap(({token}) => localStorage.setItem('jwt-token', token))
  ), {dispatch: false})

}
