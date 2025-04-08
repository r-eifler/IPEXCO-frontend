import { array, object, string, unknown, infer as zinfer } from "zod";

export const EvaluationInstanceBaseZ = object({
    name: string(),
    model: unknown(),
    actions: array(unknown()).nullish(),
    question: string(),
    explanation: string()
});

export type EvaluationInstanceBase = zinfer<typeof EvaluationInstanceBaseZ>;

export const EvaluationInstanceZ = EvaluationInstanceBaseZ.merge(object({
    _id: string(),
}));

export type EvaluationInstance = zinfer<typeof EvaluationInstanceZ>;

