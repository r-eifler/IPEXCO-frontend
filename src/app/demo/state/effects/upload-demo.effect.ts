import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { DemoService } from "../../services/demo.service";
import { loadDemo, loadDemoFailure, loadDemoPlanProperties, loadDemos, loadDemoSuccess, uploadDemo, uploadDemoFailure, uploadDemoSuccess } from "../demo.actions";

@Injectable()
export class UploadDemoEffect{

    private actions$ = inject(Actions)
    private service = inject(DemoService)

    public uploadDemo$ = createEffect(() => this.actions$.pipe(
        ofType(uploadDemo),
        switchMap(({demo, planProperties}) => this.service.postDemo$(demo, planProperties).pipe(
            switchMap(() => [uploadDemoSuccess(), loadDemos()]),
            catchError(() => of(uploadDemoFailure()))
        ))
    ))
}