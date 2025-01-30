import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { MetaProjectDomainSpecificationService } from "../../service/domainSpecification.service";
import { loadDomainSpecifications, loadDomainSpecificationsFailure, loadDomainSpecificationsSuccess } from "../project-meta.actions";


@Injectable()
export class MetaProjectLoadDomainSpecificationsEffect{

    private actions$ = inject(Actions)
    private service = inject(MetaProjectDomainSpecificationService)

    public load$ = createEffect(() => this.actions$.pipe(
        ofType(loadDomainSpecifications),
        switchMap(() => this.service.get$().pipe(
            switchMap(specs => [loadDomainSpecificationsSuccess({domainSpecifications: specs})] ),
            catchError(() => of(loadDomainSpecificationsFailure()))
        ))
    ))
}