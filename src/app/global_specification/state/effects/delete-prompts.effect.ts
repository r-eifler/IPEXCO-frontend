import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { PromptsService } from "../../service/prompts.service";
import { deleteOutputSchema, deleteOutputSchemaFailure, deleteOutputSchemaSuccess, deletePrompt, deletePromptFailure, deletePromptSuccess, loadOutputSchemas, loadPrompts } from "../globalSpec.actions";


@Injectable()
export class DeletePromptsEffect{

    private actions$ = inject(Actions)
    private service = inject(PromptsService)

    public createPrompts$ = createEffect(() => this.actions$.pipe(
        ofType(deletePrompt),
        switchMap(({id}) => this.service.deletePrompt$(id).pipe(
            switchMap(() => [deletePromptSuccess(), loadPrompts()] ),
            catchError((err) => of(deletePromptFailure(err)))
        ))
    ))


    public createOutputSchema$ = createEffect(() => this.actions$.pipe(
        ofType(deleteOutputSchema),
        switchMap(({id}) => this.service.deleteOutputSchema$(id).pipe(
            switchMap(() => [deleteOutputSchemaSuccess(), loadOutputSchemas()] ),
            catchError((err) => of(deleteOutputSchemaFailure(err)))
        ))
    ))
}