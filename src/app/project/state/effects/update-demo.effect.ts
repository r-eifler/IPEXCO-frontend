import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { demoCreationRunningFailure, demoCreationRunningSuccess, loadProjectDemos, registerDemoCreation, registerDemoCreationFailure, registerDemoCreationSuccess, updateDemo, updateDemoFailure, updateDemoSuccess} from "../project.actions";
import { catchError, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { ProjectDemoService } from "../../service/demo.service";
import { concatLatestFrom } from "@ngrx/operators";
import { Store } from "@ngrx/store";
import { selectProject } from "../project.selector";
import { DemoMonitoringService } from "../../service/demo-monitoring.service";

@Injectable()
export class UpdateDemoEffect{

    private actions$ = inject(Actions)
    private service = inject(ProjectDemoService)

    public updateDemo$ = createEffect(() => this.actions$.pipe(
        ofType(updateDemo),
        switchMap(({demo}) => this.service.putDemo$(demo).pipe(
            switchMap((demo)  => [updateDemoSuccess({demo}), loadProjectDemos({id: demo.projectId})]),
            catchError(() => of(updateDemoFailure()))
        ))
    ))

}