import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { loadProjectDemos, loadProjectDemosFailure, registerDemoCreation, registerDemoCreationFailure, registerDemoCreationSuccess} from "../project.actions";
import { catchError, map, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { DemoService } from "../../service/demo.service";
import { boolean } from "zod";
import { concatLatestFrom } from "@ngrx/operators";
import { selectIterativePlanningProject } from "src/app/iterative_planning/state/iterative-planning.selector";
import { Store } from "@ngrx/store";

@Injectable()
export class CreateDemoEffect{

    private actions$ = inject(Actions)
    private service = inject(DemoService)
    private store = inject(Store);

    public registerDemoCreation$ = createEffect(() => this.actions$.pipe(
        ofType(registerDemoCreation),
        switchMap(({demo}) => this.service.postDemo$(demo).pipe(
            concatLatestFrom(() => this.store.select(selectIterativePlanningProject)),
            switchMap(([_, project])  => [registerDemoCreationSuccess(), loadProjectDemos({id: project._id})]),
            catchError(() => of(registerDemoCreationFailure()))
        ))
    ))

}