import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { concatLatestFrom } from "@ngrx/operators";
import { Store } from "@ngrx/store";
import { concat, of } from "rxjs";
import { catchError, filter, mergeMap, switchMap, tap } from "rxjs/operators";
import { selectIsUserStudy } from "src/app/user/state/user.selector";
import { selectExecutionUserStudy } from "src/app/user_study_execution/state/user-study-execution.selector";
import { IterationStepService } from "../../service/iteration-step.service";
import { createIterationStep, createIterationStepFailure, createIterationStepSuccess, planComputationRunningSuccess, questionSuggestionFailure, questionSuggestionLoading, questionSuggestionSuccess } from "../iterative-planning.actions";
import { selectIterativePlanningCreatedStepId, selectIterativePlanningProject, selectIterativePlanningProjectExplanationInterfaceType } from "../iterative-planning.selector";
import { LLMService } from "src/app/LLM/service/llm.service";
import { ExplanationInterfaceType } from "src/app/project/domain/general-settings";

@Injectable()
export class CreateIterationStepEffect{

    private actions$ = inject(Actions);
    private service = inject(IterationStepService);
    private store = inject(Store);
    private router = inject(Router);
    private llmService = inject(LLMService);

    public createIterationStep$ = createEffect(() => this.actions$.pipe(
        ofType(createIterationStep),
        switchMap(({iterationStep}) => this.service.postIterationStep$(iterationStep).pipe(
            switchMap((iterationStep) => [createIterationStepSuccess({iterationStep})]),
            catchError((e) => of(createIterationStepFailure({err: e})))
        )),
    ));

    public navigateToCreatedIterationStep$ = createEffect(() => this.store.select(selectIterativePlanningCreatedStepId).pipe(
        filter(stepId => !!stepId),
        concatLatestFrom(() => [
            this.store.select(selectIterativePlanningProject),
            this.store.select(selectIsUserStudy),
            this.store.select(selectExecutionUserStudy)
        ]),
        tap(([stepId, project, isUserStudy, userStudy]) => {
            if(project !== undefined){
                if(isUserStudy && userStudy !== undefined){
                    this.router.navigate(['/user-study-execution',userStudy._id,'step','iterative-planning', project._id,'steps',stepId]);
                }
                else{
                    this.router.navigate(['/iterative-planning', project._id, 'steps', stepId]);
                }
            }
        })
    ), {dispatch: false});

    public triggerQuestionSuggestion$ = createEffect(() => this.actions$.pipe(
        ofType(planComputationRunningSuccess),
        concatLatestFrom(() => [
            this.store.select(selectIterativePlanningProject),
            this.store.select(selectIterativePlanningProjectExplanationInterfaceType)
        ]),
        filter(([_, project, explanationInterfaceType]) => 
            project !== undefined && 
            explanationInterfaceType === ExplanationInterfaceType.HYBRID
        ),
        mergeMap(([{iterationStepId}, project]) => {
            if (project === undefined) {
                return [];
            }
            return concat(
                of(questionSuggestionLoading({ iterationStepId })),
                this.llmService.questionSuggestion$(project._id, iterationStepId).pipe(
                    mergeMap((questions) => [
                        questionSuggestionSuccess({ iterationStepId, questions })
                    ]),
                    tap(() => console.log('Question suggestion triggered for iteration step:', iterationStepId)),
                    catchError((error) => {
                        console.error('Error triggering question suggestion:', error);
                        return of(questionSuggestionFailure({ err: error, iterationStepId }));
                    })
                )
            );
        })
    ));
}
