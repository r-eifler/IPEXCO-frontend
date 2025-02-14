import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { ServicesService } from "../../service/services.service";
import { createServiceSuccess, deleteServiceSuccess, loadServices, loadServicesFailure, loadServicesSuccess } from "../globalSpec.actions";


@Injectable()
export class LoadServicesEffect{

    private actions$ = inject(Actions)
    private servicePlanner = inject(ServicesService)

    public loadServices$ = createEffect(() => this.actions$.pipe(
        ofType(loadServices),
        switchMap(() => this.servicePlanner.get$().pipe(
            switchMap(services => [loadServicesSuccess({services: services})] ),
            catchError((err) => of(loadServicesFailure(err)))
        ))
    ));

    public roadServices$ = createEffect(() => this.actions$.pipe(
        ofType(createServiceSuccess, deleteServiceSuccess),
        switchMap(() => [loadServices()]),
    ));
}