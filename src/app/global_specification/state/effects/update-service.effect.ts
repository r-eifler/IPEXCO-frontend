import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import { ServicesService } from "../../service/services.service";
import { updateService, updateServiceFailure, updateServiceSuccess } from "../globalSpec.actions";

@Injectable()
export class UpdateServiceEffect{

    private actions$ = inject(Actions)
    private service = inject(ServicesService)

    public updateService$ = createEffect(() => this.actions$.pipe(
        ofType(updateService),
        switchMap(({service}) => this.service.put$(service).pipe(
            switchMap(service => [updateServiceSuccess({service: service})]),
            catchError((err) => of(updateServiceFailure(err)))
        ))
    ));

}