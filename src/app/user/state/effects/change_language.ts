import { inject, Injectable } from "@angular/core";
import { TranslocoService } from "@jsverse/transloco";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import { changeLanguage, changeLanguageFailure, changeLanguageSuccess } from "../user.actions";

@Injectable()
export class ChangeLanguageEffect{

    private actions$ = inject(Actions)
    private service = inject(TranslocoService)

    public load$ = createEffect(() => this.actions$.pipe(
        ofType(changeLanguage),
        switchMap(({code}) => this.service.load(code).pipe(
            switchMap(_ => [changeLanguageSuccess({code})]),
            catchError((e) => of(changeLanguageFailure({err: e})))
        ))
    ))


    public set$ = createEffect(() => this.actions$.pipe(
        ofType(changeLanguageSuccess),
        map(({code}) => this.service.setActiveLang(code))
    ), {dispatch: false})
}