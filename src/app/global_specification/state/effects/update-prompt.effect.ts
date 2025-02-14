import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { PromptsService } from "../../service/prompts.service";
import { updateOutputSchema, updateOutputSchemaFailure, updateOutputSchemaSuccess, updatePrompt, updatePromptFailure, updatePromptSuccess, loadOutputSchemas, loadPrompts } from "../globalSpec.actions";


@Injectable()
export class UpdatePromptsEffect{

    private actions$ = inject(Actions)
    private service = inject(PromptsService)

    public updatePrompts$ = createEffect(() => this.actions$.pipe(
        ofType(updatePrompt),
        switchMap(({prompt}) => this.service.putPrompt$(prompt).pipe(
            switchMap((prompt) => [updatePromptSuccess({prompt}), loadPrompts()] ),
            catchError((err) => of(updatePromptFailure(err)))
        ))
    ))


    public createOutputSchema$ = createEffect(() => this.actions$.pipe(
        ofType(updateOutputSchema),
        switchMap(({outputSchema}) => this.service.putOutputSchema$(outputSchema).pipe(
            switchMap((outputSchema) => [updateOutputSchemaSuccess({outputSchema}), loadOutputSchemas()] ),
            catchError((err) => of(updateOutputSchemaFailure(err)))
        ))
    ))
}