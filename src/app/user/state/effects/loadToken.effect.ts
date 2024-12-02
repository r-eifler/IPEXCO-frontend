import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType, OnInitEffects } from "@ngrx/effects";
import { map } from "rxjs/operators";
import { loadTokenLocalStorage, loadTokenLocalStorageFailure, loadTokenLocalStorageSuccess } from "../user.actions";

@Injectable()
export class LoadTokenEffect implements OnInitEffects{

    private actions$ = inject(Actions)

    ngrxOnInitEffects() {
        return loadTokenLocalStorage();
    }

    public loadTokenFromLocalStorage$ = createEffect(() => this.actions$.pipe(
        ofType(loadTokenLocalStorage),
        map(() => {
            const token = localStorage.getItem("jwt-token");
            if(!token){
                return loadTokenLocalStorageFailure();
            }
            else{
                return loadTokenLocalStorageSuccess({token});
            }
        }
    )))
}