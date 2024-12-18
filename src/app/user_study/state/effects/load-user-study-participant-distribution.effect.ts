import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import {loadParticipantDistribution, loadParticipantDistributionFailure, loadParticipantDistributionSuccess,} from '../user-study.actions';
import { UserStudyParticipantDistributionService } from '../../service/user-study-participant-distribution.service';

@Injectable()
export class LoadUserStudyDistributionEffect{

    private actions$ = inject(Actions)
    private service = inject(UserStudyParticipantDistributionService)

    public loadUserStudyParticipantDistribution$ = createEffect(() => this.actions$.pipe(
        ofType(loadParticipantDistribution),
        switchMap(({id}) => this.service.getParticipantDistribution$(id).pipe(
            switchMap(distribution => [loadParticipantDistributionSuccess({distribution})]),
            catchError(() => of(loadParticipantDistributionFailure()))
        ))
    ))
}
