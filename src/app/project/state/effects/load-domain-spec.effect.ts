import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { ProjectDomainSpecificationService } from "../../service/domainSpecification.service";
import { loadDomainSpecification, loadDomainSpecificationFailure, loadDomainSpecificationSuccess } from "../project.actions";


@Injectable()
export class ProjectLoadDomainSpecificationEffect{

    private actions$ = inject(Actions)
    private service = inject(ProjectDomainSpecificationService)

    public load$ = createEffect(() => this.actions$.pipe(
        ofType(loadDomainSpecification),
        switchMap(({id}) => this.service.getById$(id).pipe(
            switchMap(spec => [loadDomainSpecificationSuccess({domainSpecification: spec})] ),
            catchError(() => of(loadDomainSpecificationFailure()))
        ))
    ))
}