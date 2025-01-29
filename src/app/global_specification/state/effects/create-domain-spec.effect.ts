import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { ExplainerServicesService } from "../../service/explainer.service";
import { PlannerServicesService } from "../../service/planner.service";
import { createDomainSpecification, createDomainSpecificationFailure, createDomainSpecificationSuccess, createExplainer, createExplainerFailure, createExplainerSuccess, createPlanner, createPlannerFailure, createPlannerSuccess, loadDomainSpecifications, loadExplainers, loadPlanners } from "../globalSpec.actions";
import { DomainSpecificationService } from "../../service/domainSpecification.service";


@Injectable()
export class CreateDomainSpecificationEffect{

    private actions$ = inject(Actions)
    private service = inject(DomainSpecificationService)

    public create$ = createEffect(() => this.actions$.pipe(
        ofType(createDomainSpecification),
        switchMap(({domainSpecification}) => this.service.post$(domainSpecification).pipe(
            switchMap(spec => [createDomainSpecificationSuccess({domainSpecification: spec}), loadDomainSpecifications()] ),
            catchError(() => of(createDomainSpecificationFailure()))
        ))
    ));

}