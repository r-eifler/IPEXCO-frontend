import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { ProjectServicesService } from "../../service/services.service";
import { loadServices, loadServicesFailure, loadServicesSuccess } from "../project.actions";




@Injectable()
export class ProjectLoadServicesEffect{

    private actions$ = inject(Actions)
    private servicePlanner = inject(ProjectServicesService)

    public loadPlanners$ = createEffect(() => this.actions$.pipe(
        ofType(loadServices),
        switchMap(() => this.servicePlanner.get$().pipe(
            switchMap(services => [loadServicesSuccess({services})] ),
            catchError(() => of(loadServicesFailure()))
        ))
    ));

}