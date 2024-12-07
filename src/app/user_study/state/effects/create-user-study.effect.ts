import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {of} from 'rxjs';
import {
  createUserStudy, createUserStudyFailure,
  createUserStudySuccess
} from '../user-study.actions';
import {switchMap, catchError} from 'rxjs/operators';
import {UserStudyService} from '../../service/user-study.service';


@Injectable()
export class CreateUserStudyEffect{

    private actions$ = inject(Actions)
    private service = inject(UserStudyService)

    public createUserStudy$ = createEffect(() => this.actions$.pipe(
        ofType(createUserStudy),
        switchMap(({userStudy}) => this.service.postUserStudies$(userStudy).pipe(
            switchMap(userStudy => [createUserStudySuccess({userStudy})]),
            catchError(() => of(createUserStudyFailure()))
        ))
    ))
}
