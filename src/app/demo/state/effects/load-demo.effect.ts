import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { DemoService } from "../../services/demo.service";
import { loadDemo, loadDemoFailure, loadDemoPlanProperties, loadDemoSuccess } from "../demo.actions";

@Injectable()
export class LoadDemoEffect{

    private actions$ = inject(Actions)
    private service = inject(DemoService)

    public loadDemo$ = createEffect(() => this.actions$.pipe(
        ofType(loadDemo),
        switchMap(({id}) => this.service.getDemo$(id).pipe(
            switchMap(demo => [loadDemoSuccess({demo}), loadDemoPlanProperties({id})]),
            catchError(() => of(loadDemoFailure()))
        ))
    ))
}