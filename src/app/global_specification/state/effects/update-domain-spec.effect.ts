import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { loadDomainSpecifications, updateDomainSpecification, updateDomainSpecificationFailure, updateDomainSpecificationSuccess } from "../globalSpec.actions";
import { DomainSpecificationService } from "../../service/domainSpecification.service";


@Injectable()
export class UpdateDomainSpecificationEffect{

    private actions$ = inject(Actions)
    private service = inject(DomainSpecificationService)

    public create$ = createEffect(() => this.actions$.pipe(
        ofType(updateDomainSpecification),
        switchMap(({domainSpecification}) => this.service.put$(domainSpecification).pipe(
            switchMap(spec => [updateDomainSpecificationSuccess({domainSpecification: spec}), loadDomainSpecifications()] ),
            catchError((err) => of(updateDomainSpecificationFailure(err)))
        ))
    ));

}