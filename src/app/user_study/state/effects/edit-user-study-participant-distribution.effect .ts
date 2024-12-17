import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {of} from 'rxjs';
import {
    editParticipantDistribution,
  editParticipantDistributionFailure,
  editParticipantDistributionSuccess,
} from '../user-study.actions';
import {switchMap, catchError} from 'rxjs/operators';
import { UserStudyParticipantDistributionService } from '../../service/user-study-participant-distribution.service';


@Injectable()
export class EditUserStudyParticipantDistributionEffect{

    private actions$ = inject(Actions)
    private service = inject(UserStudyParticipantDistributionService)

    public editUserStudy$ = createEffect(() => this.actions$.pipe(
        ofType(editParticipantDistribution),
        switchMap(({distribution}) => this.service.putParticipantDistribution$(distribution).pipe(
            switchMap(distribution => [editParticipantDistributionSuccess({distribution})]),
            catchError(() => of(editParticipantDistributionFailure()))
        ))
    ))
}
