import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { loadDemos, updateDemo, updateDemoFailure, updateDemoSuccess } from "../demo.actions";
import { DemoService } from "../../services/demo.service";



@Injectable()
export class DemosUpdateDemoEffect{

    private actions$ = inject(Actions)
    private service = inject(DemoService)

    public updateDemo$ = createEffect(() => this.actions$.pipe(
        ofType(updateDemo),
        switchMap(({demo}) => this.service.putDemo$(demo).pipe(
            switchMap((demo)  => [updateDemoSuccess({demo}), loadDemos()]),
            catchError(() => of(updateDemoFailure()))
        ))
    ))

}