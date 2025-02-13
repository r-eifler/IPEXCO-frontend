import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { UserStudyExecutionEvalService } from '../../service/user-study-execution-eval.service';
import {
    acceptUserStudyParticipant,
    acceptUserStudyParticipantSuccess,
    createUserStudyFailure
} from '../user-study.actions';


@Injectable()
export class AcceptUserStudyParticipantEffect{

    private actions$ = inject(Actions)
    private service = inject(UserStudyExecutionEvalService);

    public createUserStudy$ = createEffect(() => this.actions$.pipe(
        ofType(acceptUserStudyParticipant),
        switchMap(({userId}) => this.service.accept(userId).pipe(
            switchMap(() => [acceptUserStudyParticipantSuccess()]),
            catchError(() => of(createUserStudyFailure()))
        ))
    ))
}
