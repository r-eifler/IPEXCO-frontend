import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { createDomainSpecification, createDomainSpecificationFailure, createDomainSpecificationSuccess } from "../globalSpec.actions";
import { DomainSpecificationService } from "../../service/domainSpecification.service";


@Injectable()
export class CreateDomainSpecificationEffect{

    private actions$ = inject(Actions)
    private service = inject(DomainSpecificationService)

    public create$ = createEffect(() => this.actions$.pipe(
        ofType(createDomainSpecification),
        switchMap(({domainSpecification}) => this.service.post$(domainSpecification).pipe(
            switchMap(spec => spec !== null ? [createDomainSpecificationSuccess({domainSpecification: spec})] : [createDomainSpecificationFailure({err: 'domain specification is null'})]),
            catchError((err) => of(createDomainSpecificationFailure(err)))
        ))
    ));

}