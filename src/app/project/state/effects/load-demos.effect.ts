import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { deleteProjectDemoSuccess, demoCreationRunningSuccess, loadAllDemosPlanProperties, loadProjectDemos, loadProjectDemosFailure, loadProjectDemosSuccess, registerDemoCreationSuccess} from "../project.actions";
import { catchError, map, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { ProjectDemoService } from "../../service/demo.service";
import { selectProject } from "../project.selector";
import { concatLatestFrom } from "@ngrx/operators";
import { filterListNotNullOrUndefined } from "src/app/shared/common/check_null_undefined";
import { Store } from "@ngrx/store";

@Injectable()
export class LoadProjectDemosEffect{

    private store = inject(Store);
    private actions$ = inject(Actions)
    private service = inject(ProjectDemoService)

    public loadDemos$ = createEffect(() => this.actions$.pipe(
        ofType(loadProjectDemos),
        switchMap(({id}) => this.service.getDemos$(id).pipe(
            switchMap(demos => [loadProjectDemosSuccess({demos}), loadAllDemosPlanProperties()]),
            catchError(() => of(loadProjectDemosFailure()))
        ))
    ))

    public reloadProjectDemos$ = createEffect(() => this.actions$.pipe(
        ofType(registerDemoCreationSuccess, demoCreationRunningSuccess, deleteProjectDemoSuccess),
        concatLatestFrom(() => this.store.select(selectProject)),
        filterListNotNullOrUndefined(),
        switchMap(([ _ , project]) => [loadProjectDemos({id: project._id})])
    ));
}
