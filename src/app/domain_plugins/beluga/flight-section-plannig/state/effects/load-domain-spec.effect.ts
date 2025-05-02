import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import { DomainSpecificationService } from "../../services/domainSpecification.service";
import { loadDomainSpecification, loadDomainSpecificationFailure, loadDomainSpecificationSuccess } from "../flight-section-planning.actions";

@Injectable()
export class LoadDomainSpecificationEffect{

    private actions$ = inject(Actions)
    private service = inject(DomainSpecificationService)

    public load$ = createEffect(() => this.actions$.pipe(
        ofType(loadDomainSpecification),
        switchMap(({id}) => this.service.getById$(id).pipe(
            switchMap(spec => [loadDomainSpecificationSuccess({domainSpecification: spec})] ),
            catchError((err) => of(loadDomainSpecificationFailure(err)))
        ))
    ));
}