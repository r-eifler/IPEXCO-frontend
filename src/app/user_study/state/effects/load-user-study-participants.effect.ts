import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import {
  loadUserStudyParticipants, loadUserStudyParticipantsFailure,
  loadUserStudyParticipantsSuccess,
} from '../user-study.actions';
import {UserStudyExecutionEvalService} from '../../service/user-study-execution-eval.service';


@Injectable()
export class LoadUserStudyParticipantsEffect{

    private actions$ = inject(Actions)
    private service = inject(UserStudyExecutionEvalService)

    public loadUserStudy$ = createEffect(() => this.actions$.pipe(
        ofType(loadUserStudyParticipants),
        mergeMap(({id}) => this.service.getParticipants(id).pipe(
            map(participants => loadUserStudyParticipantsSuccess({userStudyId: id, participants})),
            catchError(() => of(loadUserStudyParticipantsFailure()))
        ))
    ))
}
