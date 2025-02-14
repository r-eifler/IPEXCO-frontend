import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import { DomainSpecificationService } from "../../service/domainSpecification.service";
import { createDomainSpecificationSuccess, deleteDomainSpecificationSuccess, loadDomainSpecifications, loadDomainSpecificationsFailure, loadDomainSpecificationsSuccess } from "../globalSpec.actions";


@Injectable()
export class LoadDomainSpecificationsEffect{

    private actions$ = inject(Actions)
    private service = inject(DomainSpecificationService)

    public load$ = createEffect(() => this.actions$.pipe(
        ofType(loadDomainSpecifications),
        switchMap(() => this.service.get$().pipe(
            switchMap(specs => [loadDomainSpecificationsSuccess({domainSpecifications: specs})] ),
            catchError((err) => of(loadDomainSpecificationsFailure(err)))
        ))
    ));

    public reload$ = createEffect(() => this.actions$.pipe(
        ofType(createDomainSpecificationSuccess, deleteDomainSpecificationSuccess),
        switchMap(spec => [loadDomainSpecifications()] ),
    ));
}