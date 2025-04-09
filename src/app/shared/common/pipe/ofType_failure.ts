import { Action } from "@ngrx/store";
import { filter, pipe } from "rxjs";

export function ofTypeFailure(){
    return pipe(
        filter((a: Action) => a.type.includes("failure")),
    )
}