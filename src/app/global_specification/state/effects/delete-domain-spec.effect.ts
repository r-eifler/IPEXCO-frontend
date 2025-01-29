import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { DomainSpecificationService } from "../../service/domainSpecification.service";
import { deleteDomainSpecification, deleteDomainSpecificationSuccess, loadDomainSpecifications, deleteDomainSpecificationFailure } from "../globalSpec.actions";


@Injectable()
export class DeleteDomainSpecificationEffect{

    private actions$ = inject(Actions)
    private service = inject(DomainSpecificationService)

    public delete$ = createEffect(() => this.actions$.pipe(
        ofType(deleteDomainSpecification),
        switchMap(({id}) => this.service.delete$(id).pipe(
            switchMap(() => [deleteDomainSpecificationSuccess(), loadDomainSpecifications()] ),
            catchError(() => of(deleteDomainSpecificationFailure()))
        ))
    ));

}