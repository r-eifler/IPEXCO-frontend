import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { filterListNotNullOrUndefined } from 'src/app/shared/common/check_null_undefined';
import { UserStudyExecutionEvalService } from '../../service/user-study-execution-eval.service';
import {
    acceptUserStudyParticipantSuccess,
    loadUserStudyParticipants, loadUserStudyParticipantsFailure,
    loadUserStudyParticipantsSuccess,
} from '../user-study.actions';
import { selectUserStudy } from '../user-study.selector';


@Injectable()
export class LoadUserStudyParticipantsEffect{

    private store = inject(Store);
    private actions$ = inject(Actions)
    private service = inject(UserStudyExecutionEvalService)

    public loadUserStudy$ = createEffect(() => this.actions$.pipe(
        ofType(loadUserStudyParticipants),
        mergeMap(({id}) => this.service.getParticipants(id).pipe(
            map(participants => loadUserStudyParticipantsSuccess({userStudyId: id, participants})),
            catchError(() => of(loadUserStudyParticipantsFailure()))
        ))
    ));

    public reloadUserStudy$ = createEffect(() => this.actions$.pipe(
        ofType(acceptUserStudyParticipantSuccess),
        concatLatestFrom(() => this.store.select(selectUserStudy)),
        filterListNotNullOrUndefined(),
        switchMap(([_, userStudy]) => [loadUserStudyParticipants({id: userStudy._id})])
    ));
}
