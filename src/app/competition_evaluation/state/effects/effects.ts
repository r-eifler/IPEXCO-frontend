import { LoadEvaluationInstancesEffect } from "./load-plans.effect";
import { UploadEvaluationInstancesEffect } from "./upload-eval-instance.effect";

export const competitionEvaluationFeatureEffects = [
    LoadEvaluationInstancesEffect,
    UploadEvaluationInstancesEffect,
]