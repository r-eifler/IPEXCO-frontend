import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { demoCreationRunningFailure, demoCreationRunningSuccess, loadProjectDemos, registerDemoCreation, registerDemoCreationFailure, registerDemoCreationSuccess, uploadProjectDemoImage, uploadProjectDemoImageSuccess} from "../project.actions";
import { catchError, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { DemoService } from "../../service/demo.service";
import { concatLatestFrom } from "@ngrx/operators";
import { Store } from "@ngrx/store";
import { selectProject } from "../project.selector";
import { DemoMonitoringService } from "../../service/demo-monitoring.service";

@Injectable()
export class CreateDemoEffect{

    private actions$ = inject(Actions)
    private service = inject(DemoService)
    private monitoringService = inject(DemoMonitoringService)
    private store = inject(Store);

    // public uploadDemoImage$ = createEffect(() => this.actions$.pipe(
    //     ofType(uploadProjectDemoImage),
    //     switchMap(({image}) => this.service.postDemoImage$(image).pipe(
    //         switchMap((imagePath)  => [uploadProjectDemoImageSuccess({imagePath})]),
    //         catchError(() => of(registerDemoCreationFailure()))
    //     ))
    // ))

    public registerDemoCreation$ = createEffect(() => this.actions$.pipe(
        ofType(registerDemoCreation),
        switchMap(({demo, properties}) => this.service.postDemo$(demo, properties).pipe(
            concatLatestFrom(() => this.store.select(selectProject)),
            switchMap(([id, project])  => [registerDemoCreationSuccess({id}), loadProjectDemos({id: project._id})]),
            catchError(() => of(registerDemoCreationFailure()))
        ))
    ))

    public listenDemoComputationFinished$ = createEffect(() => this.actions$.pipe(
        ofType(registerDemoCreationSuccess),
        concatLatestFrom(() => this.store.select(selectProject)),
        switchMap(([{id}, {_id: projectId}]) => {
            return this.monitoringService.demoComputationFinished$(id).pipe(
                switchMap(() => [demoCreationRunningSuccess(), loadProjectDemos({id: projectId})]),
                catchError(() => of(demoCreationRunningFailure())),
            )
        })
    ))

}