import { strict } from "assert";
import { IterationStep } from "../iteration_step";
import { AnswerType, Question, QuestionType } from "./explanations";

type Validator = (step: IterationStep, ppId: string) => boolean;
type AnswerComputer = (
    step: IterationStep, 
    question: Question, 
    computed: string[][], 
    complete: boolean) => [string, string[][]];

export interface ExplanationTemplate {
    questionType: QuestionType;
    forSolvableInstance: boolean,
    questionParameters: string[],
    parameterValidator?: Validator,
    questionPhrase: string,
    answerType: AnswerType,
    answerComputer: AnswerComputer,
}

function whyAnswerComputer(step: IterationStep, question: Question, computed: string[][]): string[][] {
        return computed.filter(
            MUGS => {
                MUGS.every(id => 
                    ((step.plan !== undefined) && 
                    (step.plan.satisfied_properties !== undefined) &&
                    step.plan.satisfied_properties.includes(id)) ||
                    question.parameters.includes(id)
                )
            }
        ).map(MUGS => MUGS.filter(id =>  ! question.parameters.includes(id)))
    }


function howAnswerComputer(step: IterationStep, question: Question, computed: string[][]): string[][] {
    return computed.filter(
        MCGS => {
            MCGS.every(id => 
                ! question.parameters.includes(id)
            )
        }
    ).map(MUGS => MUGS.filter(id =>  step.plan?.satisfied_properties.includes(id)))
}

export const explanationTemplates: ExplanationTemplate[] = [
    {
        questionType: QuestionType.WHY,
        forSolvableInstance: false,
        questionParameters: [],
        questionPhrase: "Why is the selection of enforced goals unsolvable?",
        answerType: AnswerType.MUGS,
        answerComputer: (step: IterationStep, q, computed: string[][], c) => 
            [
                "The selection is unsolvable because of the following conflicts",
                computed.filter(
                    MUGS => MUGS.every(id => step.hardGoals.includes(id))
                )
            ]
    },
    {
        questionType: QuestionType.HOW,
        forSolvableInstance: false,
        questionParameters: [],
        questionPhrase: "How can I make it solvable?",
        answerType: AnswerType.MGCS,
        answerComputer: (step: IterationStep, q, computed: string[][], c) => 
            [
                "To make the is solvable you have to forego one of the following sets",  
                computed.filter(
                    MGCS => MGCS.some(id => step.hardGoals.includes(id))
                ).map(MGCS => MGCS.filter(id => step.hardGoals.includes(id)))
                ]
    },
    {
        questionType: QuestionType.WHY_NOT,
        forSolvableInstance: true,
        questionParameters: ['$P1'],
        parameterValidator:  (step: IterationStep, ppId: string) => ! step.plan?.satisfied_properties?.includes(ppId),
        questionPhrase: "Why is $P1 not satisfied?",
        answerType: AnswerType.MUGS,
        answerComputer: (step: IterationStep, question, computed: string[][], complete) => {
            const answers = whyAnswerComputer(step, question, computed);
            // TODO check which role complete plays
            if (answers.length == 0){
                return [
                    "The goal can be satisfied without impacting any of the already satisfied goals.",  
                    []
                ]
            }
            if (answers.some(s => s.length == 0)){
                return [
                    "The goal itself cannot be satisfied.",  
                    []  
                ]
            }

            return [
                "Because there is a conflict with each of the following sets: ",  
                answers  
            ]        
        }
    },
    {
        questionType: QuestionType.WHAT_IF,
        forSolvableInstance: true,
        questionParameters: ['$P1'],
        parameterValidator:  (step: IterationStep, ppId: string) => ! step.plan?.satisfied_properties?.includes(ppId),
        questionPhrase: "What happens if I enforce $P1?",
        answerType: AnswerType.MUGS,
        answerComputer: (step: IterationStep, question, computed: string[][], complete) => {
            const answers = whyAnswerComputer(step, question, computed);
            // TODO check which role complete plays
            if (answers.length == 0){
                return [
                    "The goal can be satisfied without impacting any of the already satisfied goals.",  
                    []
                ]
            }
            if (answers.some(s => s.length == 0)){
                return [
                    "Then the problem would be unsolvable.",  
                    []  
                ]
            }

            return [
                "You could no longer satisfy any of the goal sets: ",  
                answers  
            ]  
        }
    },
    {
        questionType: QuestionType.CAN,
        forSolvableInstance: true,
        questionParameters: ['$P1'],
        parameterValidator:  (step: IterationStep, ppId: string) => ! step.plan?.satisfied_properties?.includes(ppId),
        questionPhrase: "Can $P1 be enforced?",
        answerType: AnswerType.MUGS,
        answerComputer: (step: IterationStep, question, computed: string[][], complete) => {
            const answers = whyAnswerComputer(step, question, computed);
            // TODO check which role complete plays
            if (answers.length == 0){
                return [
                    "Yes, it can be enforced",  
                    []
                ]
            }

            return [
                "It is not possible.",  
                [] 
            ]  
        }
    },
    {
        questionType: QuestionType.HOW,
        forSolvableInstance: true,
        questionParameters: ['$P1'],
        parameterValidator:  (step: IterationStep, ppId: string) => ! step.plan?.satisfied_properties?.includes(ppId),
        questionPhrase: "How can $P1 be satisfied?",
        answerType: AnswerType.MUGS,
        answerComputer: (step: IterationStep, question, computed: string[][], complete) => {
            const answers = howAnswerComputer(step, question, computed);
            // TODO check which role complete plays
            if (answers.some(s => s.length == 0)){
                return [
                    "The goal can be satisfied without impacting any of the already satisfied goals.",
                    []  
                ]
            }

            if (answers.length == 0){
                return [
                    "It is not possible.",
                    []
                ]
            }

            return [
                "You have to forgo one of the goal sets in: ",  
                answers  
            ]        
        }
    },
]