import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { DemoServicesService } from "../../services/planner.service";
import { loadServices, loadServicesSuccess, loadServicesFailure } from "../demo.actions";


@Injectable()
export class DemoLoadServicesEffect{

    private actions$ = inject(Actions)
    private service = inject(DemoServicesService)

    public loadServices$ = createEffect(() => this.actions$.pipe(
        ofType(loadServices),
        switchMap(() => this.service.get$().pipe(
            switchMap(services => [loadServicesSuccess({services})] ),
            catchError(() => of(loadServicesFailure()))
        ))
    ));

}