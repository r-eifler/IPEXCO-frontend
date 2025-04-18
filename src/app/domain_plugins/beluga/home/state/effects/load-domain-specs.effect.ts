import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { HomeDomainSpecificationService } from "../../services/domainSpecification.service";
import { loadDomainSpecifications, loadDomainSpecificationsFailure, loadDomainSpecificationsSuccess } from "../home.actions";



@Injectable()
export class HomeLoadDomainSpecificationsEffect{

    private actions$ = inject(Actions)
    private service = inject(HomeDomainSpecificationService)

    public load$ = createEffect(() => this.actions$.pipe(
        ofType(loadDomainSpecifications),
        switchMap(() => this.service.get$().pipe(
            switchMap(specs => [loadDomainSpecificationsSuccess({domainSpecifications: specs})] ),
            catchError((e) => of(loadDomainSpecificationsFailure({err: e})))
        ))
    ))
}