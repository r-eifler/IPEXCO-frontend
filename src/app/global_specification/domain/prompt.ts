import { nativeEnum, nullable, object, string, infer as zinfer } from "zod";

export enum AgentType {
    EXPLANATION_TRANSLATOR = 'EXPLANATION_TRANSLATOR',
    GOAL_TRANSLATOR = 'GOAL_TRANSLATOR',
    QUESTION_CLASSIFIER = 'QUESTION_CLASSIFIER',
    NONE = 'NONE'
}

export enum PromptType {
    SYSTEM = 'SYSTEM',
    INSTRUCTION_AND_EXAMPLES  = 'INSTRUCTION_AND_EXAMPLES',
    INPUT_DATA = 'INPUT_DATA',
    NONE = 'NONE'
}

export const AgentTypeZ = nativeEnum(AgentType);
export const PromptTypeZ = nativeEnum(PromptType);

export const PromptBaseZ = object({
    name: string(),
    agent: AgentTypeZ,
    type: PromptTypeZ,
    domain: nullable(string()),
    explainer: nullable(string()),
    text: string(),
});

export type PromptBase = zinfer<typeof PromptBaseZ>;

export const PromptZ = PromptBaseZ.merge(
    object({
        _id: string()
    })
);

export type Prompt = zinfer<typeof PromptZ>;


export const OutputSchemaBaseZ = object({
    name: string(),
    agent: AgentTypeZ,
    domain: nullable(string()),
    explainer: nullable(string()),
    text: string(),
});

export type OutputSchemaBase = zinfer<typeof OutputSchemaBaseZ>;

export const OutputSchemaZ = OutputSchemaBaseZ.merge(
    object({
        _id: string(),
    })
);

export type OutputSchema = zinfer<typeof OutputSchemaZ>;

