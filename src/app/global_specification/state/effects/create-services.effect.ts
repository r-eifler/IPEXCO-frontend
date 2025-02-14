import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { ServicesService } from "../../service/services.service";
import { createService, createServiceFailure, createServiceSuccess, loadServices } from "../globalSpec.actions";

@Injectable()
export class CreateServicesEffect{

    private actions$ = inject(Actions)
    private service = inject(ServicesService)

    public createServices$ = createEffect(() => this.actions$.pipe(
        ofType(createService),
        switchMap(({service}) => this.service.post$(service).pipe(
            switchMap(service => service !== null ? [createServiceSuccess({service: service})] : [createServiceFailure()]),
            catchError(() => of(createServiceFailure()))
        ))
    ));

}