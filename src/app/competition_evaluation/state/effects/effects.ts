import { DeleteEvaluationInstancesEffect } from "./delete-eval-instance.effect";
import { LoadEvaluationInstancesEffect } from "./load-plans.effect";
import { UploadEvaluationInstancesEffect } from "./upload-eval-instance.effect";

export const competitionEvaluationFeatureEffects = [
    LoadEvaluationInstancesEffect,
    UploadEvaluationInstancesEffect,
    DeleteEvaluationInstancesEffect,
]