


import { PlanProperty } from "src/app/shared/domain/plan-property/plan-property";
import { IterationStep } from "src/app/iterative_planning/domain/iteration_step";
import { PDDLObject, PDDLPredicate } from "src/app/shared/domain/planning-task";


// goal-translator

interface GoalTranslationRequest {
    goalDescription: string,
    predicated: PDDLPredicate[],
    objects: PDDLObject[],
    existingPlanProperties: PlanProperty[]
}

enum GoalTranslationStatus {
    success,
    error,
    unsupported,
    unconfident, // Please check result,
    alreadyExists
}

interface GoalTranslationResponse {
    formula: string | undefined,
    status: GoalTranslationStatus,
    userInfo: string,
    existingPlanProperty: string | undefined,
    interactionHistory: string,
}


// question-translator

interface QuestionTranslationRequest {
    question: string,
    predicated: PDDLPredicate[],
    objects: PDDLObject[],
    enforcedGoals: PlanProperty[],
    satisfiedGoals: PlanProperty[],
    unsatisfiedGoals: PlanProperty[],
    existingPlanProperties: PlanProperty[]
}


enum QuestionTranslationStatus {
    success,
    error,
    unsupported,
    unconfident, // Please check result,
    directAnswer
}

interface QuestionTranslationResponse {
    newProperties: {naturalLanguage: string, formula: string}[],
    status: QuestionTranslationStatus,
    userInfo: string,
    answer: string,
    question_type: string,
    questionArgument: PlanProperty[],
    interactionHistory: string,
}



// explanation-translator

interface ExplanationTranslationRequest {
    question: string,
    question_type: string,
    questionArgument: PlanProperty[]
    MUGS: PlanProperty[][],
    MGCS: PlanProperty[][],
    predicated: PDDLPredicate[],
    objects: PDDLObject[],
    enforcedGoals: PlanProperty[],
    satisfiedGoals: PlanProperty[],
    unsatisfiedGoals: PlanProperty[],
    existingPlanProperties: PlanProperty[],
    history: IterationStep[]
}

enum ExplanationTranslationStatus {
    success,
    error,
    unsupported,
    unconfident, // Please check result,
    directAnswer
}


interface ExplanationTranslationResponse {
    status: ExplanationTranslationStatus,
    userInfo: string,
    answer: string,
    interactionHistory: string,
}