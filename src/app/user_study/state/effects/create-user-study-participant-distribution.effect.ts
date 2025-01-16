import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {of} from 'rxjs';
import {
    createParticipantDistribution,
  createParticipantDistributionFailure,
  createParticipantDistributionSuccess,
} from '../user-study.actions';
import {switchMap, catchError} from 'rxjs/operators';
import { UserStudyParticipantDistributionService } from '../../service/user-study-participant-distribution.service';


@Injectable()
export class CreateUserStudyParticipantDistributionEffect{

    private actions$ = inject(Actions)
    private service = inject(UserStudyParticipantDistributionService)

    public createUserStudy$ = createEffect(() => this.actions$.pipe(
        ofType(createParticipantDistribution),
        switchMap(({distribution}) => this.service.postParticipantDistribution$(distribution).pipe(
            switchMap(distribution => [createParticipantDistributionSuccess({distribution})]),
            catchError(() => of(createParticipantDistributionFailure()))
        ))
    ))
}
