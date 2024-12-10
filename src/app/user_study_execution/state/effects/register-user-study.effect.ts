import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import {registerUserStudyUser, registerUserStudyUserFailure, registerUserStudyUserSuccess} from '../user-study-execution.actions';
import {UserStudyAuthenticationService} from '../../service/user-study-authentication.service';
import {registerUserSuccess} from '../../../user/state/user.actions';
import {concatLatestFrom} from '@ngrx/operators';
import {Store} from '@ngrx/store';
import {selectExecutionUserStudy} from '../user-study-execution.selector';
import {Router} from '@angular/router';

@Injectable()
export class RegisterUserStudyEffect{

    private store = inject(Store);
    private router = inject(Router);
    private actions$ = inject(Actions)
    private service = inject(UserStudyAuthenticationService)

    public registerUserStudyUser$ = createEffect(() => this.actions$.pipe(
        ofType(registerUserStudyUser),
        switchMap(({id}) => this.service.register(id).pipe(
            switchMap(({user, token}) => [registerUserStudyUserSuccess({user, token}), registerUserSuccess({user, token})]),
            catchError(() => of(registerUserStudyUserFailure()))
        ))
    ))

    public startWithFirstStep$ = createEffect(() => this.actions$.pipe(
      ofType(registerUserStudyUserSuccess),
      concatLatestFrom(() => this.store.select(selectExecutionUserStudy)),
      tap(([_, study]) => this.router.navigate(['user-study-execution', study?._id, 'step', '0']))
    ), {dispatch: false})
}
