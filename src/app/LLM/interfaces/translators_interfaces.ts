import { PDDLObject, PDDLPredicate } from "src/app/shared/domain/PDDL_task";
import { PlanProperty } from "src/app/shared/domain/plan-property/plan-property";

export interface GoalTranslationRequest {
    goalDescription: string,
    predicates: PDDLPredicate[],
    objects: PDDLObject[],
    existingPlanProperties: PlanProperty[],
}


export interface QuestionTranslationRequest {
    question: string,
    enforcedGoals: PlanProperty[],
    satisfiedGoals: PlanProperty[],
    unsatisfiedGoals: PlanProperty[],
    existingPlanProperties: PlanProperty[],
    solvable: string
}

export interface ExplanationTranslationRequest {
    question: string,
    question_type: string,
    questionArgument: PlanProperty[],
    MUGS?: PlanProperty[][],
    MGCS?: PlanProperty[][], // todo call it explanation then change it in string method
    predicates: PDDLPredicate[],
    objects: PDDLObject[],
    enforcedGoals: PlanProperty[],
    satisfiedGoals: PlanProperty[],
    unsatisfiedGoals: PlanProperty[],
    existingPlanProperties: PlanProperty[],
}


export interface QTthenGTResponse {
    questionTranslation: string,
    goalTranslation: string,
    questionType: string,
    goal: string,
    initialQuestion: string
}
