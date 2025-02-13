export enum AgentType {
    EXPLANATION_TRANSLATOR = 'EXPLANATION_TRANSLATOR',
    GOAL_TRANSLATOR = 'GOAL_TRANSLATOR',
    QUESTION_CLASSIFIER = 'QUESTION_CLASSIFIER',
}

export enum PromptType {
    SYSTEM = 'SYSTEM',
    INSTRUCTION_AND_EXAMPLES  = 'INSTRUCTION_AND_EXAMPLES',
    INPUT_DATA = 'INPUT_DATA',
}

export interface PromptBase {
    name: string;
    agent: AgentType;
    type: PromptType;
    domain: string | null;
    explainer: string | null;
    text: string;
}

export interface Prompt extends PromptBase{
    _id: string;
}

export interface OutputSchemaBase {
    name: string;
    agent: AgentType;
    domain: string | null;
    explainer: string | null;
    text: string;
}

export interface OutputSchema extends OutputSchemaBase {
    _id: string;
}