import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { concatLatestFrom } from "@ngrx/operators";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import { filterListNotNullOrUndefined } from "src/app/shared/common/check_null_undefined";
import { ProjectDemoService } from "../../service/demo.service";
import { cancelDemoCreation, cancelDemoCreationFailure, cancelDemoCreationSuccess, loadProjectDemos } from "../project.actions";
import { selectProject } from "../project.selector";

@Injectable()
export class CancelCreateDemoEffect{

    private actions$ = inject(Actions)
    private service = inject(ProjectDemoService)
    private store = inject(Store);


    public cancelDemoCreation$ = createEffect(() => this.actions$.pipe(
        ofType(cancelDemoCreation),
        switchMap(({demoId}) => this.service.postCancelDemo$(demoId).pipe(
            concatLatestFrom(() => this.store.select(selectProject)),
            filterListNotNullOrUndefined(),
            switchMap(([ _ , project])  => [cancelDemoCreationSuccess(), loadProjectDemos({id: project._id})]),
            catchError(() => of(cancelDemoCreationFailure()))
        ))
    ))

}