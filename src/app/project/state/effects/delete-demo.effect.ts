import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import { ProjectDemoService } from "../../service/demo.service";
import { deleteProjectDemo, deleteProjectDemoFailure, deleteProjectDemoSuccess } from "../project.actions";

@Injectable()
export class DeleteProjectDemoEffect{

    private actions$ = inject(Actions);
    private service = inject(ProjectDemoService);

    public deleteDemo$ = createEffect(() => this.actions$.pipe(
        ofType(deleteProjectDemo),
        switchMap(({id}) => this.service.deleteDemo$(id).pipe(
            switchMap(deleted => deleted ? [deleteProjectDemoSuccess()] : [deleteProjectDemoFailure()]),
            catchError(() => of(deleteProjectDemoFailure()))
        ))
    ))
}