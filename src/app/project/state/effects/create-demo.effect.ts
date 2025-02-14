import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import { DemoMonitoringService } from "../../service/demo-monitoring.service";
import { ProjectDemoService } from "../../service/demo.service";
import { demoCreationRunningFailure, demoCreationRunningSuccess, registerDemoCreation, registerDemoCreationFailure, registerDemoCreationSuccess } from "../project.actions";

@Injectable()
export class CreateDemoEffect{

    private actions$ = inject(Actions)
    private service = inject(ProjectDemoService)
    private monitoringService = inject(DemoMonitoringService)


    public registerDemoCreation$ = createEffect(() => this.actions$.pipe(
        ofType(registerDemoCreation),
        switchMap(({demo, properties}) => this.service.postDemo$(demo, properties).pipe(
            switchMap((id)  => !id ? [registerDemoCreationFailure()] : [registerDemoCreationSuccess({id})]),
            catchError(() => of(registerDemoCreationFailure()))
        ))
    ));

    public listenDemoComputationFinished$ = createEffect(() => this.actions$.pipe(
        ofType(registerDemoCreationSuccess),
        switchMap(({id}) => 
            this.monitoringService.demoComputationFinished$(id).pipe(
                switchMap(() => [demoCreationRunningSuccess()]),
                catchError(() => of(demoCreationRunningFailure())),
            )
        )
    ));

}