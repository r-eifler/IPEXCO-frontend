import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import { PolicyTestingTestCollectionsService } from "../../services/tests.service";
import { finishedTestStateFuzzingFailure, finishedTestStateFuzzingSuccess, loadTestCollections, startTestStateFuzzing, startTestStateFuzzingFailure, startTestStateFuzzingSuccess } from "../policy-testing.actions";
import { FuzzingMonitoringService } from "../../services/fuzzing-monitoring.service";

@Injectable()
export class StartTestStateFuzzingEffect{

    private actions$ = inject(Actions)
    private service = inject(PolicyTestingTestCollectionsService)
    private monitoringService = inject(FuzzingMonitoringService)

    public start$ = createEffect(() => this.actions$.pipe(
        ofType(startTestStateFuzzing),
        switchMap(({testSuiteId, numberOfFuzzedStates}) => this.service.startFuzzing$(testSuiteId, numberOfFuzzedStates).pipe(
            switchMap(testCollection => [
                startTestStateFuzzingSuccess({testCollection}),
                loadTestCollections({projectId: testCollection.project})
            ]),
            catchError((e) => of(startTestStateFuzzingFailure({err: e})))
        ))
    ))

    public listenFuzzingFinished$ = createEffect(() => this.actions$.pipe(
        ofType(startTestStateFuzzingSuccess),
        switchMap(({ testCollection }) => {
            return this.monitoringService.planComputationFinished$(testCollection._id).pipe(
                switchMap((finished) => {
                    if(finished){
                        return [
                            finishedTestStateFuzzingSuccess({id: testCollection._id}),
                            loadTestCollections({projectId: testCollection.project})
                        ]
                    }else{
                        return [loadTestCollections({projectId: testCollection.project})]
                    }
                        
                }),
                catchError((e) => of(finishedTestStateFuzzingFailure({err: e}))),
            )
        })
    ));
}