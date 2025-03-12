import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import { DomainSpecificationService } from "../../service/domainSpecification.service";
import { deleteDomainSpecification, deleteDomainSpecificationFailure, deleteDomainSpecificationSuccess } from "../globalSpec.actions";


@Injectable()
export class DeleteDomainSpecificationEffect{

    private actions$ = inject(Actions)
    private service = inject(DomainSpecificationService)

    public delete$ = createEffect(() => this.actions$.pipe(
        ofType(deleteDomainSpecification),
        switchMap(({id}) => this.service.delete$(id).pipe(
            switchMap(() => [deleteDomainSpecificationSuccess()]),
            catchError((err) => of(deleteDomainSpecificationFailure(err)))
        ))
    ));

}