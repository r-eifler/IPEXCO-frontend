import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import {distributeParticipant, distributeParticipantFailure, distributeParticipantSuccess } from '../user-study-execution.actions';
import { NextUserStudyService } from '../../service/user-study-selection.service';
import { Router } from '@angular/router';


@Injectable()
export class RedirectToNextUserStudyEffect{

    private actions$ = inject(Actions)
    private service = inject(NextUserStudyService)
    private router = inject(Router);

    public redirect$ = createEffect(() => this.actions$.pipe(
        ofType(distributeParticipant),
        switchMap(({distributionId}) => this.service.getNextStudy$(distributionId).pipe(
            tap((userStudyId) => this.router.navigate(['user-study-execution', userStudyId])),
            map(() => distributeParticipantSuccess()),
            catchError(() => of(distributeParticipantFailure()))
        ))
    ))
}
