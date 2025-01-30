enum AgentType {
    EXPLANATION_TRANSLATOR = 'EXPLANATION_TRANSLATOR',
    GOAL_TRANSLATOR = 'GOAL_TRANSLATOR',
    QUESTION_CLASSIFIER = 'QUESTION_CLASSIFIER',
}

enum PromptType {
    SYSTEM = 'SYSTEM',
    INSTRUCTION_AND_EXAMPLES  = 'INSTRUCTION_AND_EXAMPLES',
    INPUT_DATA = 'INPUT_DATA'
}

export interface Prompt {
    _id?: string,
    agent: AgentType,
    type: PromptType,
    domain: string | null,
    explainer: string | null,
    text: string,
}

export interface OutputSchema {
    _id?: string,
    agent: AgentType,
    domain: string | null,
    explainer: string | null,
    text: string,
}