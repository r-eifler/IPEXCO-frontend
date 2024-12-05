import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { loadProjectDemos, updateDemo, updateDemoFailure, updateDemoSuccess} from "../project.actions";
import { catchError, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { DemoService } from "../../service/demo.service";
import { Store } from "@ngrx/store";
@Injectable()
export class UpdateDemoEffect{

    private actions$ = inject(Actions)
    private service = inject(DemoService)
    private store = inject(Store);

    public updateDemo$ = createEffect(() => this.actions$.pipe(
        ofType(updateDemo),
        switchMap(({demo}) => this.service.putDemo$(demo).pipe(
            switchMap((demo)  => [updateDemoSuccess({demo}), loadProjectDemos({id: demo.projectId})]),
            catchError(() => of(updateDemoFailure()))
        ))
    ))

}