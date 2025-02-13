import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { demoCreationRunningFailure, demoCreationRunningSuccess, loadProjectDemos, registerDemoCreation, registerDemoCreationFailure, registerDemoCreationSuccess, uploadProjectDemoImage, uploadProjectDemoImageSuccess} from "../project.actions";
import { catchError, filter, mergeMap, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { ProjectDemoService } from "../../service/demo.service";
import { concatLatestFrom } from "@ngrx/operators";
import { Action, Store } from "@ngrx/store";
import { selectProject } from "../project.selector";
import { DemoMonitoringService } from "../../service/demo-monitoring.service";
import { project } from "ramda";
import { filterListNotNullOrUndefined } from "src/app/shared/common/check_null_undefined";

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