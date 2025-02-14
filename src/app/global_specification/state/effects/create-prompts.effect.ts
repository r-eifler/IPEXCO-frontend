import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { PromptsService } from "../../service/prompts.service";
import { createOutputSchema, createOutputSchemaFailure, createOutputSchemaSuccess, createPrompt, createPromptFailure, createPromptSuccess, loadOutputSchemas, loadPrompts } from "../globalSpec.actions";


@Injectable()
export class CreatePromptsEffect{

    private actions$ = inject(Actions)
    private service = inject(PromptsService)

    public createPrompts$ = createEffect(() => this.actions$.pipe(
        ofType(createPrompt),
        switchMap(({prompt}) => this.service.postPrompt$(prompt).pipe(
            switchMap(prompt => prompt !== null ? [createPromptSuccess({prompt})] : [createPromptFailure()]),
            catchError(() => of(createPromptFailure()))
        ))
    ))


    public createOutputSchema$ = createEffect(() => this.actions$.pipe(
        ofType(createOutputSchema),
        switchMap(({outputSchema}) => this.service.postOutputSchema$(outputSchema).pipe(
            switchMap(outputSchema => outputSchema !== null ? [createOutputSchemaSuccess({outputSchema})] : [createOutputSchemaFailure()]),
            catchError(() => of(createOutputSchemaFailure()))
        ))
    ))
}