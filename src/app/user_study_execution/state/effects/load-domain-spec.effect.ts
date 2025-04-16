import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { UserStudyExecutionDomainSpecificationService } from "../../service/domainSpecification.service";
import { loadDomainSpecification, loadDomainSpecificationFailure, loadDomainSpecificationSuccess } from "../user-study-execution.actions";


@Injectable()
export class UserStudyExecutionLoadDomainSpecificationEffect{

    private actions$ = inject(Actions)
    private service = inject(UserStudyExecutionDomainSpecificationService)

    public load$ = createEffect(() => this.actions$.pipe(
        ofType(loadDomainSpecification),
        switchMap(({id}) => this.service.getById$(id).pipe(
            switchMap(spec => [loadDomainSpecificationSuccess({domainSpecification: spec})] ),
            catchError((e) => of(loadDomainSpecificationFailure({err: e})))
        ))
    ))
}