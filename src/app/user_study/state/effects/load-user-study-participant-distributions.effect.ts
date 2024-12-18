import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import {loadParticipantDistributions, loadParticipantDistributionsFailure, loadParticipantDistributionsSuccess} from '../user-study.actions';
import { UserStudyParticipantDistributionService } from '../../service/user-study-participant-distribution.service';

@Injectable()
export class LoadUserStudyDistributionsEffect{

    private actions$ = inject(Actions)
    private service = inject(UserStudyParticipantDistributionService)

    public loadUserStudyParticipantDistributions$ = createEffect(() => this.actions$.pipe(
        ofType(loadParticipantDistributions),
        switchMap(() => this.service.getParticipantDistributions$().pipe(
            switchMap(distributions => [
                loadParticipantDistributionsSuccess({distributions: distributions}),
            ]),
            catchError(() => of(loadParticipantDistributionsFailure()))
        ))
    ))
}
