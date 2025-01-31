import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { PromptsService } from "../../service/prompts.service";
import { loadOutputSchema, loadOutputSchemaFailure, loadOutputSchemaSuccess, loadPrompt, loadPromptFailure, loadPromptSuccess } from "../globalSpec.actions";


@Injectable()
export class LoadPromptEffect{

    private actions$ = inject(Actions)
    private service = inject(PromptsService)

    public loadPrompt$ = createEffect(() => this.actions$.pipe(
        ofType(loadPrompt),
        switchMap(({id}) => this.service.getPrompt$(id).pipe(
            switchMap(prompt => [loadPromptSuccess({prompt})] ),
            catchError(() => of(loadPromptFailure()))
        ))
    ))


    public loadOutputSchema$ = createEffect(() => this.actions$.pipe(
        ofType(loadOutputSchema),
        switchMap(({id}) => this.service.getOutputSchema$(id).pipe(
            switchMap(schema => [loadOutputSchemaSuccess({outputSchema: schema})] ),
            catchError(() => of(loadOutputSchemaFailure()))
        ))
    ))
}