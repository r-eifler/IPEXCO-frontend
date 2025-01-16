import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {of} from 'rxjs';
import {
  editUserStudy, editUserStudyFailure,
  editUserStudySuccess, loadUserStudy
} from '../user-study.actions';
import {switchMap, catchError} from 'rxjs/operators';
import {UserStudyService} from '../../service/user-study.service';


@Injectable()
export class EditUserStudyEffect{

    private actions$ = inject(Actions)
    private service = inject(UserStudyService)

    public editUserStudy$ = createEffect(() => this.actions$.pipe(
        ofType(editUserStudy),
        switchMap(({userStudy}) => this.service.putUserStudy$(userStudy).pipe(
            switchMap(userStudy => [editUserStudySuccess({userStudy})]),
            catchError(() => of(editUserStudyFailure()))
        ))
    ))
}
