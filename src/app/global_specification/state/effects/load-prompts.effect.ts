import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { loadOutputSchemas, loadOutputSchemasFailure, loadOutputSchemasSuccess, loadPrompts, loadPromptsFailure, loadPromptsSuccess } from "../globalSpec.actions";
import { PromptsService } from "../../service/prompts.service";


@Injectable()
export class LoadPromptsEffect{

    private actions$ = inject(Actions)
    private service = inject(PromptsService)

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