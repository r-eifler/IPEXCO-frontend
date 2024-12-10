import { IterationStep } from "../../iterative_planning/domain/iteration_step";
import { PDDLPredicate, PDDLObject } from "../../shared/domain/planning-task";
import { Message } from "../domain/message";
import { Question } from "src/app/iterative_planning/domain/interface/question";
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
