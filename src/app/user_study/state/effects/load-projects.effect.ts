import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { UserStudyProjectService } from '../../service/user-study-project.service';
import { loadUserStudyProjects, loadUserStudyProjectsFailure, loadUserStudyProjectsSuccess } from '../user-study.actions';


@Injectable()
export class LoadUserStudyProjectsEffect{

    private actions$ = inject(Actions)
    private service = inject(UserStudyProjectService)

    public loadProjects$ = createEffect(() => this.actions$.pipe(
        ofType(loadUserStudyProjects),
        switchMap(() => this.service.getAllProjects$().pipe(
            switchMap(projects => [loadUserStudyProjectsSuccess({projects})]),
            catchError((err) => of(loadUserStudyProjectsFailure(err)))
        ))
    ))
}
