import { IterationStep } from "../../iterative_planning/domain/iteration_step";
import { PlanProperty } from "../../iterative_planning/domain/plan-property/plan-property";
import { PDDLPredicate, PDDLObject } from "../../interface/planning-task";
import { Message } from "../domain/message";



// goal-translator

export interface GoalTranslationRequest {
    goalDescription: string,
    predicates: PDDLPredicate[],
    objects: PDDLObject[],
    existingPlanProperties: PlanProperty[],

}
// TODO : add more features
export interface GoalTranslationResponse {
    formula: string 
}

// enum GoalTranslationStatus {
//     success,
//     error,
//     unsupported,
//     unconfident, // Please check result,
//     alreadyExists
// }

// question-translator

export interface QuestionTranslationRequest {
    question: string,
    enforcedGoals: PlanProperty[],
    satisfiedGoals: PlanProperty[],
    unsatisfiedGoals: PlanProperty[],
    existingPlanProperties: PlanProperty[]
}
export interface QuestionTranslationResponse {
    newProperties: { naturalLanguage: string, formula: string }[],
    // status: QuestionTranslationStatus,
    userInfo: string,
    answer: string,
    question_type: string,
    questionArguments: PlanProperty[],
    interactionHistory: string,
}

// enum QuestionTranslationStatus {
//     success,
//     error,
//     unsupported,
//     unconfident, // Please check result,
//     directAnswer
// }

// explanation-translator

export interface ExplanationTranslationRequest {
    question: string,
    question_type: string,
    questionArguments: PlanProperty[]
    MUGS: PlanProperty[][],
    MGCS: PlanProperty[][],
    predicates: PDDLPredicate[],
    objects: PDDLObject[],
    enforcedGoals: PlanProperty[],
    satisfiedGoals: PlanProperty[],
    unsatisfiedGoals: PlanProperty[],
    existingPlanProperties: PlanProperty[],
    history: IterationStep[]

}


export interface ExplanationTranslationResponse {
    // status: ExplanationTranslationStatus,
    userInfo: string,
    answer: string,
    interactionHistory: string,
}

// enum ExplanationTranslationStatus {
//     success,
//     error,
//     unsupported,
//     unconfident, // Please check result,
//     directAnswer
// }


export interface QuestionTranslationHistoryStep {
    input: QuestionTranslationRequest,
    output: QuestionTranslationResponse
}

export interface GoalTranslationHistoryStep {
    input: GoalTranslationRequest,
    output: GoalTranslationResponse
}

export interface ExplanationTranslationHistoryStep {
    input: ExplanationTranslationRequest,
    output: ExplanationTranslationResponse
}

export type QuestionTranslationHistory = QuestionTranslationHistoryStep[]
export type GoalTranslationHistory = GoalTranslationHistoryStep[]
export type ExplanationTranslationHistory = ExplanationTranslationHistoryStep[]

export type TranslationHistory = QuestionTranslationHistory | GoalTranslationHistory | ExplanationTranslationHistory
export type TranslationHistoryStep = QuestionTranslationHistoryStep | GoalTranslationHistoryStep | ExplanationTranslationHistoryStep
export type TranslationRequest = QuestionTranslationRequest | GoalTranslationRequest | ExplanationTranslationRequest
export type TranslationResponse = QuestionTranslationResponse | GoalTranslationResponse | ExplanationTranslationResponse

export interface BackendLLMRequest {
    request: string,
    threadId?: string
}

export interface BackendLLMResponse {
    response: string,
    threadId: string
}