import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import {UserStudyService} from '../../service/user-study.service';
import {loadUserStudies, loadUserStudiesFailure, loadUserStudiesSuccess} from '../user-study.actions';

@Injectable()
export class LoadUserStudiesEffect{

    private actions$ = inject(Actions)
    private service = inject(UserStudyService)

    public loadUserStudies$ = createEffect(() => this.actions$.pipe(
        ofType(loadUserStudies),
        switchMap(() => this.service.getUserStudies$().pipe(
            map(userStudies => loadUserStudiesSuccess({userStudies})),
            catchError(() => of(loadUserStudiesFailure()))
        ))
    ))
}
