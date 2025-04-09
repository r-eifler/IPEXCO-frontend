import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import { ServicesService } from "../../service/services.service";
import { loadServices, loadServicesFailure, loadServicesSuccess } from "../planning.actions";


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
}