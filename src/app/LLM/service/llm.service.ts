import { inject, Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { catchError, concatMap, map, tap } from "rxjs/operators";
import { IHTTPData } from "src/app/interface/http-data.interface";
import { Message } from "../domain/message";
import { ExplanationTranslationRequest, GoalTranslationRequest, QTthenGTResponse, QuestionTranslationRequest } from "../interfaces/translators_interfaces";
import { Question } from "src/app/iterative_planning/domain/interface/question";
import { PlanProperty } from "src/app/iterative_planning/domain/plan-property/plan-property";
import { Project } from "src/app/project/domain/project";
import { goalTranslationRequestToString, questionTranslationRequestToString } from "../interfaces/translators_interfaces_strings";
import { IterationStep, StepStatus } from "src/app/iterative_planning/domain/iteration_step";
import { PlanRunStatus } from "src/app/iterative_planning/domain/plan";
import { QuestionType } from "src/app/iterative_planning/domain/explanation/explanations";
import { Store } from "@ngrx/store";
@Injectable()
export class LLMService{

    private http = inject(HttpClient)
    private BASE_URL = environment.apiURL + "llm/";

    
    // postMessage$(messages: Message[] ): Observable<string> {
    //     console.log(messages);
    //     return this.http.post<IHTTPData<string>>(this.BASE_URL + "simple", { data: messages }).pipe(
    //         map(({ data }) => data),
    //         tap(console.log)
    //     );
    // }
    
    postMessageGT$(request: string, project: Project, properties: PlanProperty[], threadId: string): Observable<{response: string, threadId: string}> {
        const goalTranslationRequest: GoalTranslationRequest = {
            goalDescription: request,
            predicates: project.baseTask.model.predicates,
            objects: project.baseTask.model.objects,
            existingPlanProperties: Object.values(properties)
        };
        const requestString = goalTranslationRequestToString(goalTranslationRequest);
        console.log(requestString);
        return this.http.post<IHTTPData<BackendLLMResponse>>(this.BASE_URL + 'gt', { data: requestString, threadId: threadId }).pipe(
            map(({ data }) => ({response: data.response, threadId: data.threadId})),
            tap(console.log)
        );
    }

    postMessageQT$(request: string, threadId: string): Observable<BackendLLMResponse> {
        console.log(request);
        return this.http.post<IHTTPData<BackendLLMResponse>>(this.BASE_URL + 'qt', { data: request, threadId: threadId }).pipe(
            map(({ data }) => data),
            tap(console.log)
        );
    }

    postMessageET$(question: string, explanation:string[][],question_type: QuestionType, questionArguments: PlanProperty[], iterationStep: IterationStep, project: Project, properties: PlanProperty[], threadId: string): Observable<BackendLLMResponse> {
        console.log(question, question_type, questionArguments, iterationStep, project, properties, threadId);
        const request: ExplanationTranslationRequest = {
            question: question,
            question_type: question_type,
            MUGS: explanation.map(e => e.map(p => properties[p])), if question_type is not HOW
            questionArguments: questionArguments,
            predicates: project.baseTask.model.predicates,
            objects: project.baseTask.model.objects,
            enforcedGoals: iterationStep.hardGoals.map(p => properties[p]),
            satisfiedGoals: iterationStep.plan.satisfied_properties.map(p => properties[p]),
            unsatisfiedGoals: iterationStep.softGoals
                .filter(id => !iterationStep.plan.satisfied_properties.includes(id))
                .map(p => properties[p]),
            existingPlanProperties: Object.values(properties)
          };
        return this.http.post<IHTTPData<BackendLLMResponse>>(this.BASE_URL + 'et', { data: request, threadId: threadId }).pipe(
            map(({ data }) => data),
            tap(console.log)
        );
    }

    postMessageQTthenGT$(question: string, iterationStep: IterationStep, project: Project, properties: PlanProperty[], threadIdQt: string, threadIdGt: string): Observable<{ question: Question, threadIdQt: string, threadIdGt: string }> {
        
        const questionTranslationRequest: QuestionTranslationRequest = {
            question: question,
            enforcedGoals: iterationStep.hardGoals.map(p => properties[p]),
            satisfiedGoals: iterationStep.plan.satisfied_properties.map(p => properties[p]),
            unsatisfiedGoals: iterationStep.softGoals
                .filter(id => !iterationStep.plan.satisfied_properties.includes(id))
                .map(p => properties[p]),
            existingPlanProperties: Object.values(properties),
            solvable: iterationStep.plan.status == PlanRunStatus.not_solvable ? "false" : "true"
        };
        const qtRequestString = questionTranslationRequestToString(questionTranslationRequest);

        // Create and stringify Goal Translator request
        const goalTranslationRequest: GoalTranslationRequest = {
            goalDescription: "{goal_description}",
            predicates: project.baseTask.model.predicates,
            objects: project.baseTask.model.objects,
            existingPlanProperties: Object.values(properties)
        };
        const gtRequestString = goalTranslationRequestToString(goalTranslationRequest);

        console.log(qtRequestString, gtRequestString);
        return this.http.post<IHTTPData<QTthenGTResponse>>(this.BASE_URL + 'qt-then-gt', { qtRequest: qtRequestString, gtRequest: gtRequestString, projectId: project._id, threadIdQt, threadIdGt }).pipe(
            // First identify if the goal already exists then builds the correct plan property the save if then return it 
            map(({ data }) => ({ question: { iterationStepId: iterationStep._id, questionType: data.questionType, propertyId: data.goal }, threadIdQt, threadIdGt })), 
            tap(console.log)
        );
    }
}


function baseExplanationTransatorRequest(question: string, questionType: QuestionType): ExplanationTranslationRequest {
    let store = inject(Store);
    let request: ExplanationTranslationRequest;
    
    combineLatest([
      store.select(selectIterativePlanningProject),
      store.select(selectIterativePlanningProperties),
      store.select(selectThreadIdET),
      store.select(selectEnforcedGoals),
      store.select(selectSatisfiedSoftGoals),
      store.select(selectUnsatisfiedSoftGoals)
    ]).subscribe(([projectData, properties, threadIdET, enforcedGoals, solvedSoftGoals, unsolvedSoftGoals]) => {
      
    });
    
    return request!;
  }