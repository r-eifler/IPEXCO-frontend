import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { loadProjectMetaDataList, loadProjectMetaDataListFailure, loadProjectMetaDataListSuccess } from "../project-meta.actions";
import { ProjectMetaDataService } from "../../service/project-meta-data.service";

@Injectable()
export class LoadProjectMetaDataListEffect{

    private actions$ = inject(Actions)
    private service = inject(ProjectMetaDataService)

    public loadProjectMetaDataList$ = createEffect(() => this.actions$.pipe(
        ofType(loadProjectMetaDataList),
        switchMap(() => this.service.getProjectList$().pipe(
            map(projects => loadProjectMetaDataListSuccess({projects})),
            catchError(() => of(loadProjectMetaDataListFailure()))
        ))
    ))
}