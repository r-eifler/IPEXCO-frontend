import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {UserStudyDemoService} from '../../service/user-study-demo.service';
import {of} from 'rxjs';
import {loadUserStudiesFailure, loadUserStudyDemos, loadUserStudyDemosSuccess} from '../user-study.actions';
import {switchMap, catchError} from 'rxjs/operators';


@Injectable()
export class LoadUserStudyDemosEffect{

    private actions$ = inject(Actions)
    private service = inject(UserStudyDemoService)

    public loadDemos$ = createEffect(() => this.actions$.pipe(
        ofType(loadUserStudyDemos),
        switchMap(() => this.service.getAllDemos$().pipe(
            switchMap(demos => [loadUserStudyDemosSuccess({demos})]),
            catchError(() => of(loadUserStudiesFailure()))
        ))
    ))
}
