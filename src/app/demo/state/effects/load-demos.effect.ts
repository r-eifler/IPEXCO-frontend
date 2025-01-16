import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { DemoService } from "../../services/demo.service";
import { loadAllDemosPlanProperties, loadDemos, loadDemosFailure, loadDemosSuccess } from "../demo.actions";

@Injectable()
export class LoadDemosEffect{

    private actions$ = inject(Actions)
    private service = inject(DemoService)

    public loadDemos$ = createEffect(() => this.actions$.pipe(
        ofType(loadDemos),
        switchMap(() => this.service.getDemos$().pipe(
            switchMap(demos => [loadDemosSuccess({demos}), loadAllDemosPlanProperties()]),
            catchError(() => of(loadDemosFailure()))
        ))
    ))
}
