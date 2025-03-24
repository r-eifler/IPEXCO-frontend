import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { createOutputSchemaSuccess, createPromptSuccess, loadOutputSchemas, loadOutputSchemasFailure, loadOutputSchemasSuccess, loadPrompts, loadPromptsFailure, loadPromptsSuccess } from "../globalSpec.actions";
import { PromptsService } from "../../service/prompts.service";


@Injectable()
export class LoadPromptsEffect{

    private actions$ = inject(Actions)
    private service = inject(PromptsService)

    public loadPrompts$ = createEffect(() => this.actions$.pipe(
        ofType(loadPrompts),
        switchMap(() => this.service.getPrompts$().pipe(
            switchMap(prompts => [loadPromptsSuccess({prompts})] ),
            catchError((err) => of(loadPromptsFailure(err)))
        ))
    ))

    public reloadPrompts$ = createEffect(() => this.actions$.pipe(
        ofType(createPromptSuccess),
        switchMap(() => [loadPrompts()] ),
    ));


    public loadOutputSchema$ = createEffect(() => this.actions$.pipe(
        ofType(loadOutputSchemas),
        switchMap(() => this.service.getOutputSchemas$().pipe(
            switchMap(schemas => [loadOutputSchemasSuccess({outputSchemas: schemas})] ),
            catchError((err) => of(loadOutputSchemasFailure(err)))
        ))
    ));

    public reloadOutputSchema$ = createEffect(() => this.actions$.pipe(
        ofType(createOutputSchemaSuccess),
        switchMap(() => [loadOutputSchemas()] ),
    ));
}