import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { deleteProjectDemo, deleteProjectDemoFailure, deleteProjectDemoSuccess, loadDemoPlanProperties, loadProjectDemo, loadProjectDemoFailure, loadProjectDemos, loadProjectDemoSuccess} from "../project.actions";
import { catchError, map, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { ProjectDemoService } from "../../service/demo.service";
import { concatLatestFrom } from "@ngrx/operators";
import { Store } from "@ngrx/store";
import { selectProject } from "../project.selector";

@Injectable()
export class DeleteProjectDemoEffect{

    private actions$ = inject(Actions);
    private store = inject(Store);
    private service = inject(ProjectDemoService);

    public deleteDemo$ = createEffect(() => this.actions$.pipe(
        ofType(deleteProjectDemo),
        switchMap(({id}) => this.service.deleteDemo$(id).pipe(
            concatLatestFrom((demo) => this.store.select(selectProject)),
            switchMap(([demo, {_id}]) => [deleteProjectDemoSuccess(), loadProjectDemos({id: _id})]),
            catchError(() => of(deleteProjectDemoFailure()))
        ))
    ))
}