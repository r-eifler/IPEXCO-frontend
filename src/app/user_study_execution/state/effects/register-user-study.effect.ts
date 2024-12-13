import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, combineLatestWith, filter, switchMap, tap } from 'rxjs/operators';
import { combineLatest, of } from 'rxjs';
import {executionUserStudyStart, registerUserStudyUser, registerUserStudyUserFailure, registerUserStudyUserSuccess} from '../user-study-execution.actions';
import {UserStudyAuthenticationService} from '../../service/user-study-authentication.service';
import {registerUserSuccess} from '../../../user/state/user.actions';
import { Store } from '@ngrx/store';
import { selectIsUserStudy, selectLoggedInAndUserLoaded } from 'src/app/user/state/user.selector';
import { selectExecutionUserStudy } from '../user-study-execution.selector';
import { concatLatestFrom } from '@ngrx/operators';
import { Router } from '@angular/router';

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

    public userStudyLoggedIn$ = createEffect(() => combineLatest([
            this.store.select(selectLoggedInAndUserLoaded),
            this.store.select(selectIsUserStudy)
        ]).pipe(
        filter(([loggedIn, isUserStudy]) => loggedIn && isUserStudy),
        concatLatestFrom(() => this.store.select(selectExecutionUserStudy)),
        tap(([_, study]) => this.router.navigate(['user-study-execution', study?._id, 'step'])),
        switchMap(() => [executionUserStudyStart()])
    ))

}
