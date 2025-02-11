import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { DemoPromptsService } from "../../services/prompts.service";
import { loadOutputSchemas, loadOutputSchemasFailure, loadOutputSchemasSuccess, loadPrompts, loadPromptsFailure, loadPromptsSuccess } from "../demo.actions";



@Injectable()
export class DemoLoadPromptsEffect{

    private actions$ = inject(Actions)
    private service = inject(DemoPromptsService)

    public loadPrompts$ = createEffect(() => this.actions$.pipe(
        ofType(loadPrompts),
        switchMap(() => this.service.getPrompts$().pipe(
            switchMap(prompts => [loadPromptsSuccess({prompts})] ),
            catchError(() => of(loadPromptsFailure()))
        ))
    ))


    public loadOutputSchema$ = createEffect(() => this.actions$.pipe(
        ofType(loadOutputSchemas),
        switchMap(() => this.service.getOutputSchemas$().pipe(
            switchMap(schemas => [loadOutputSchemasSuccess({outputSchemas: schemas})] ),
            catchError(() => of(loadOutputSchemasFailure()))
        ))
    ))
}