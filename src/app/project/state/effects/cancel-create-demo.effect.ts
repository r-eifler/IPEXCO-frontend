import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { demoCreationRunningFailure, demoCreationRunningSuccess, loadProjectDemos, cancelDemoCreation, cancelDemoCreationFailure, cancelDemoCreationSuccess, uploadProjectDemoImage, uploadProjectDemoImageSuccess} from "../project.actions";
import { catchError, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { ProjectDemoService } from "../../service/demo.service";
import { concatLatestFrom } from "@ngrx/operators";
import { Store } from "@ngrx/store";
import { selectProject } from "../project.selector";
import { DemoMonitoringService } from "../../service/demo-monitoring.service";

@Injectable()
export class CancelCreateDemoEffect{

    private actions$ = inject(Actions)
    private service = inject(ProjectDemoService)
    private store = inject(Store);


    public cancelDemoCreation$ = createEffect(() => this.actions$.pipe(
        ofType(cancelDemoCreation),
        switchMap(({demoId}) => this.service.postCancelDemo$(demoId).pipe(
            concatLatestFrom(() => this.store.select(selectProject)),
            switchMap(([id, project])  => [cancelDemoCreationSuccess(), loadProjectDemos({id: project._id})]),
            catchError(() => of(cancelDemoCreationFailure()))
        ))
    ))

}