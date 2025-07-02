import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { BelugaProjectServicesService } from "../../services/services.service";
import { loadServices, loadServicesFailure, loadServicesSuccess } from "../home.actions";




@Injectable()
export class BelugaProjectLoadServicesEffect{

    private actions$ = inject(Actions)
    private servicePlanner = inject(BelugaProjectServicesService)

    public loadPlanners$ = createEffect(() => this.actions$.pipe(
        ofType(loadServices),
        switchMap(() => this.servicePlanner.get$().pipe(
            switchMap(services => [loadServicesSuccess({services})] ),
            catchError((e) => of(loadServicesFailure({err: e})))
        ))
    ));

}