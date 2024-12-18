import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import {UserStudyService} from '../../service/user-study.service';
import {loadUserStudy, loadUserStudyFailure, loadUserStudyParticipants, loadUserStudySuccess} from '../user-study.actions';

@Injectable()
export class LoadUserStudyEffect{

    private actions$ = inject(Actions)
    private service = inject(UserStudyService)

    public loadUserStudy$ = createEffect(() => this.actions$.pipe(
        ofType(loadUserStudy),
        switchMap(({id}) => this.service.getUserStudy$(id).pipe(
            switchMap(userStudy => [loadUserStudySuccess({userStudy}), loadUserStudyParticipants({id: userStudy._id})]),
            catchError(() => of(loadUserStudyFailure()))
        ))
    ))
}
