import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { DemoDomainSpecificationService } from "../../services/domainSpecification.service";
import { loadDomainSpecification, loadDomainSpecificationFailure, loadDomainSpecificationSuccess } from "../demo.actions";


@Injectable()
export class DemoLoadDomainSpecificationEffect{

    private actions$ = inject(Actions)
    private service = inject(DemoDomainSpecificationService)

    public load$ = createEffect(() => this.actions$.pipe(
        ofType(loadDomainSpecification),
        switchMap(({id}) => this.service.getById$(id).pipe(
            switchMap(spec => [loadDomainSpecificationSuccess({domainSpecification: spec})] ),
            catchError(() => of(loadDomainSpecificationFailure()))
        ))
    ))
}