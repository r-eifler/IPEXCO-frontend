import { inject, Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { catchError, concatMap, map, tap } from "rxjs/operators";
import { IHTTPData } from "src/app/shared/domain/http-data.interface";
import { Message } from "../domain/message";
import { ExplanationTranslationRequest, GoalTranslationRequest, QTthenGTResponse, QuestionTranslationRequest } from "../interfaces/translators_interfaces";
import { Question } from "src/app/iterative_planning/domain/interface/question";
import { explanationTranslationRequestToString, goalTranslationRequestToString, questionTranslationRequestToString } from "../interfaces/translators_interfaces_strings";
import { IterationStep, StepStatus } from "src/app/iterative_planning/domain/iteration_step";
import { PlanRunStatus } from "src/app/iterative_planning/domain/plan";
import { QuestionType } from "src/app/iterative_planning/domain/explanation/explanations";
import { Store } from "@ngrx/store";
import { LLMContext } from "../domain/context";
import { PlanProperty } from "src/app/shared/domain/plan-property/plan-property";
import { Project } from "src/app/shared/domain/project";
@Injectable()
export class LLMService {

    private http = inject(HttpClient)
    private BASE_URL = environment.apiURL + "llm/";


    // postMessage$(messages: Message[] ): Observable<string> {
    //     console.log(messages);
    //     return this.http.post<IHTTPData<string>>(this.BASE_URL + "simple", { data: messages }).pipe(
    //         map(({ data }) => data),
    //         tap(console.log)
    //     );
    // }

    postMessageGT$(request: string, project: Project, properties: PlanProperty[], threadId: string): Observable<{ response: { formula: string, shortName: string, reverseTranslation: string, feedback: string }, threadId: string }> {
        const goalTranslationRequest: GoalTranslationRequest = {
            goalDescription: request,
            predicates: project.baseTask.model.predicates,
            objects: project.baseTask.model.objects,
            existingPlanProperties: Object.values(properties)
        };
        const requestString = goalTranslationRequestToString(goalTranslationRequest);
        console.log(requestString);
        return this.http.post<IHTTPData<{ response: { formula: string, shortName: string, reverseTranslation: string, feedback: string }, threadId: string }>>(this.BASE_URL + 'gt', { data: requestString, threadId: threadId, originalRequest: request, projectId: project._id }).pipe(
            map(({ data }) => data),
            tap(console.log)
        );
    }

    postMessageQT$(question: string, iterationStep: IterationStep, project: Project, properties: PlanProperty[], threadId: string): Observable<
        | { directResponse: string, questionType: QuestionType, threadId: string }
        | { response: { questionType: QuestionType, goal: string, question: Question, reverseTranslation: string }, threadId: string }
    > {        
            const questionTranslationRequest: QuestionTranslationRequest = {
                question: question,
                enforcedGoals: properties?.filter(p => p && iterationStep.hardGoals?.includes(p._id)) ?? [],
                satisfiedGoals: properties?.filter(p => p && iterationStep.plan?.satisfied_properties?.includes(p._id)) ?? [],
                unsatisfiedGoals: properties?.filter(p => p && !iterationStep.plan?.satisfied_properties?.includes(p._id)) ?? [],
                existingPlanProperties: Object.values(properties ?? []),
                solvable: iterationStep.plan?.status == PlanRunStatus.not_solvable ? "false" : "true"
            };

            const requestString = questionTranslationRequestToString(questionTranslationRequest);
            
            return this.http.post<IHTTPData<{ response: { questionType: QuestionType, goal: string, question: Question, reverseTranslation: string }, threadId: string }>>(
                this.BASE_URL + 'qt', 
                { 
                    qtRequest: requestString, 
                    threadId: threadId, 
                    iterationStepId: iterationStep._id, 
                    projectId: project._id,
                    originalQuestion: question 
                }
            ).pipe(
                map(({ data }) => data),
                tap(console.log)
            );
        
    }

    postMessageET$(question: string, explanationMUGS: string[][], explanationMGCS: string[][], question_type: QuestionType, questionArgument: PlanProperty[], iterationStep: IterationStep, project: Project, properties: PlanProperty[], threadId: string): Observable<{ response: string, threadId: string }> {
        console.log(question, question_type, questionArgument, iterationStep, project, properties, threadId);
        const request: ExplanationTranslationRequest = {
            question: question,
            question_type: question_type ,
            MUGS: explanationMUGS.map(e => e.map(pid => properties.find(p => p._id == pid))),
            MGCS: explanationMGCS.map(e => e.map(pid => properties.find(p => p._id == pid))),
            questionArgument: questionArgument,
            predicates: project.baseTask.model.predicates,
            objects: project.baseTask.model.objects,
            enforcedGoals: properties.filter(p => iterationStep.hardGoals.includes(p._id)),
            satisfiedGoals: properties.filter(p => iterationStep.plan.satisfied_properties.includes(p._id)),
            unsatisfiedGoals: properties.filter(p => !iterationStep.plan.satisfied_properties.includes(p._id)),
            existingPlanProperties: Object.values(properties)
        };
        const requestString = explanationTranslationRequestToString(request);
        return this.http.post<IHTTPData<{ response: string, threadId: string }>>(this.BASE_URL + 'et', { data: requestString, threadId: threadId, iterationStepId: iterationStep._id, projectId: project._id, originalRequest: question }).pipe(
            map(({ data }) => data),
            tap(console.log)
        );
    }

    postDirectMessageET$(directResponse: string, project: Project, iterationStep: IterationStep, threadId: string): Observable<{ response: string, threadId: string }> {
        return this.http.post<IHTTPData<{ response: string, threadId: string }>>(this.BASE_URL + 'et', { data: directResponse, threadId: threadId, projectId: project._id, iterationStepId: iterationStep._id, originalRequest: directResponse }).pipe(
            map(({ data }) => data),
            tap(console.log)
        );
    }

    postMessageQTthenGT$(question: string, iterationStep: IterationStep, project: Project, properties: PlanProperty[], threadIdQt: string, threadIdGt: string): Observable<
        | { gtResponse: string, qtResponse: string, threadIdQt: string, threadIdGt: string, questionType: QuestionType, goal: string, question: Question, reverseTranslationQT: string, reverseTranslationGT: string }
        | { directResponse: string, questionType: QuestionType, threadIdQt: string, threadIdGt: string }
    > {
        console.log("Properties", properties);
        console.log("IterationStep", iterationStep);
        console.log("Enforced Goals", iterationStep.hardGoals.map(p => properties[p]));
        console.log("Hard Goals", iterationStep.hardGoals);
        const questionTranslationRequest: QuestionTranslationRequest = {
            question: question,
            enforcedGoals: properties.filter(p => iterationStep.hardGoals.includes(p._id)),
            satisfiedGoals: properties.filter(p => iterationStep.plan.satisfied_properties.includes(p._id)),
            unsatisfiedGoals: properties.filter(p => !iterationStep.plan.satisfied_properties.includes(p._id)),
            existingPlanProperties: Object.values(properties),
            solvable: iterationStep.plan.status == PlanRunStatus.not_solvable ? "false" : "true"
        };
        console.log(questionTranslationRequest);
        const qtRequestString = questionTranslationRequestToString(questionTranslationRequest);

        // Create and stringify Goal Translator request
        const goalTranslationRequest: GoalTranslationRequest = {
            goalDescription: "{goal_description}",
            predicates: project.baseTask.model.predicates,
            objects: project.baseTask.model.objects,
            existingPlanProperties: Object.values(properties)
        };
        console.log(goalTranslationRequest);
        const gtRequestString = goalTranslationRequestToString(goalTranslationRequest);

        console.log(qtRequestString, gtRequestString);
        return this.http.post<IHTTPData<
            | { gtResponse: string, qtResponse: string, threadIdQt: string, threadIdGt: string, questionType: QuestionType, goal: string, question: Question, reverseTranslationQT: string, reverseTranslationGT: string }
            | { directResponse: string , questionType: QuestionType, threadIdQt: string, threadIdGt: string}
        >>(this.BASE_URL + 'qt-then-gt', { 
            qtRequest: qtRequestString, 
            gtRequest: gtRequestString, 
            projectId: project._id, 
            threadIdQt, 
            threadIdGt, 
            iterationStepId: iterationStep._id, 
            originalQuestion: question
        }).pipe(
            map(({ data }) => data),
            tap(console.log)
        );
    }

    getLLMContext$(id: string): Observable<LLMContext> {

        let httpParams = new HttpParams();
        httpParams = httpParams.set('projectId', id);

        return this.http.get<IHTTPData<LLMContext>>(this.BASE_URL + "llm-context", { params: httpParams }).pipe(
            map(({ data }) => data)
        )
    }

    createLLMContext$(projectId: string, domain: string): Observable<LLMContext> {
        console.log("Creating LLM context for projectId: ", projectId, "and domain: ", domain);
        return this.http.post<IHTTPData<LLMContext>>(this.BASE_URL + "create-llm-context", 
            { projectId, domain  }
        ).pipe(
            map(({ data }) => data),
            tap(response => console.log('Successfully created LLM context:', response)),
            catchError(error => {
                console.error('Error creating LLM context:', error);
                throw error;
            })
        );
    }
}




