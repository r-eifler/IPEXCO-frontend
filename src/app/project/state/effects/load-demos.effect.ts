import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { loadProjectDemos, loadProjectDemosFailure, loadProjectDemosSuccess} from "../project.actions";
import { catchError, map, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { DemoService } from "../../service/demo.service";

@Injectable()
export class LoadProjectDemosEffect{

    private actions$ = inject(Actions)
    private service = inject(DemoService)

    public loadDemos$ = createEffect(() => this.actions$.pipe(
        ofType(loadProjectDemos),
        switchMap(({id}) => this.service.getDemos$(id).pipe(
            map(demos => loadProjectDemosSuccess({demos})),
            catchError(() => of(loadProjectDemosFailure()))
        ))
    ))
}