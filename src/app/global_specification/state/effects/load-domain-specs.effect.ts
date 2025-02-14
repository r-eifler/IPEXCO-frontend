import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { DomainSpecificationService } from "../../service/domainSpecification.service";
import { createDomainSpecificationSuccess, loadDomainSpecifications, loadDomainSpecificationsFailure, loadDomainSpecificationsSuccess } from "../globalSpec.actions";


@Injectable()
export class LoadDomainSpecificationsEffect{

    private actions$ = inject(Actions)
    private service = inject(DomainSpecificationService)

    public load$ = createEffect(() => this.actions$.pipe(
        ofType(loadDomainSpecifications),
        switchMap(() => this.service.get$().pipe(
            switchMap(specs => [loadDomainSpecificationsSuccess({domainSpecifications: specs})] ),
            catchError(() => of(loadDomainSpecificationsFailure()))
        ))
    ));

    public reload$ = createEffect(() => this.actions$.pipe(
        ofType(createDomainSpecificationSuccess),
        switchMap(spec => [loadDomainSpecifications()] ),
    ));
}