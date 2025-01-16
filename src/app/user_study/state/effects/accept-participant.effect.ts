import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {of} from 'rxjs';
import {
    acceptUserStudyParticipant,
    acceptUserStudyParticipantSuccess,
    createUserStudyFailure,
    loadUserStudyParticipants
} from '../user-study.actions';
import {switchMap, catchError} from 'rxjs/operators';
import { UserStudyExecutionEvalService } from '../../service/user-study-execution-eval.service';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { selectUserStudy } from '../user-study.selector';


@Injectable()
export class AcceptUserStudyParticipantEffect{

    private actions$ = inject(Actions)
    private service = inject(UserStudyExecutionEvalService)
    private store = inject(Store);

    public createUserStudy$ = createEffect(() => this.actions$.pipe(
        ofType(acceptUserStudyParticipant),
        concatLatestFrom(() => this.store.select(selectUserStudy)),
        switchMap(([{userId}, study]) => this.service.accept(userId).pipe(
            switchMap(() => [acceptUserStudyParticipantSuccess(), loadUserStudyParticipants({id: study._id})]),
            catchError(() => of(createUserStudyFailure()))
        ))
    ))
}
