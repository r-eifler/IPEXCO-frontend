import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { ServicesService } from "../../service/services.service";
import { deleteService, deleteServiceFailure, deleteServiceSuccess, loadServices } from "../globalSpec.actions";


@Injectable()
export class DeleteServicesEffect{

    private actions$ = inject(Actions)
    private service = inject(ServicesService)

    public deletePlanners$ = createEffect(() => this.actions$.pipe(
        ofType(deleteService),
        switchMap(({id}) => this.service.delete$(id).pipe(
            switchMap(() => [deleteServiceSuccess()] ),
            catchError((err) => of(deleteServiceFailure(err)))
        ))
    ));

}