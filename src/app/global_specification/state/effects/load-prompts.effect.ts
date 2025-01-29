import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { loadPrompts, loadPromptsFailure, loadPromptsSuccess } from "../globalSpec.actions";
import { PromptsService } from "../../service/prompts.service";


@Injectable()
export class LoadPromptsEffect{

    private actions$ = inject(Actions)
    private service = inject(PromptsService)

    public load$ = createEffect(() => this.actions$.pipe(
        ofType(loadPrompts),
        switchMap(() => this.service.get$().pipe(
            switchMap(prompts => [loadPromptsSuccess({prompts})] ),
            catchError(() => of(loadPromptsFailure()))
        ))
    ))
}