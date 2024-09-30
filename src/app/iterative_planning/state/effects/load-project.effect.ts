import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { IterativePlanningProjectService } from "../../service/project.service";
import { loadPlanProperties, loadProject, loadProjectFailure, loadProjectSuccess } from "../iterative-planning.actions";
import { Store } from "@ngrx/store";
import { concatLatestFrom } from "@ngrx/operators";
import { selectProject } from "src/app/project/state/project.selector";
import { selectIterativePlanningProject } from "../iterative-planning.selector";

@Injectable()
export class LoadIterativePlanningProjectEffect{

    private actions$ = inject(Actions)
    private service = inject(IterativePlanningProjectService)

    private store = inject(Store);

    public loadProject$ = createEffect(() => this.actions$.pipe(
        ofType(loadProject),
        switchMap(({id}) => this.service.getProject$(id).pipe(
            switchMap(project => [loadProjectSuccess({project}), loadPlanProperties({id})]),
            catchError(() => of(loadProjectFailure())),
        ))
    ))

    // loadPlanProperties$ = createEffect(() => this.actions$.pipe(
    //     ofType(loadProjectSuccess),
    //     concatLatestFrom(() => this.store.select(selectIterativePlanningProject)),
    //     map(([_, { _id: id }]) => loadPlanProperties({ id })),
    // ));
}