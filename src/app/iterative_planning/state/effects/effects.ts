import { CancelPlanIterationStepEffect } from "./cancel-plan-iteration-step.effect";
import { ComputeExplanationEffect } from "./compute-explanation.effect";
import { ComputePlanEffect } from "./compute-plan.effect";
import { CreateIterationStepEffect } from "./create-iteration-step.effect";
import { CreateLLMContextEffect } from "./create-llm-context.effect";
import { CreatePlanPropertyEffect } from "./create-plan-property.effect";
import { DeleteIterationEffect } from "./delete-iteration-step.effect";
import { DeletePlanPropertyEffect } from "./delete-plan-property.effect";
import { IterativePlanningLoadDomainSpecificationEffect } from "./load-domain-spec.effect";
import { LoadIterationStepsEffect } from "./load-iteration-steps.effect";
import { LoadPlanPropertiesEffect } from "./load-plan-properties.effect";
import { LoadIterativePlanningProjectEffect } from "./load-project.effect";
import { QuestionQueueEffect } from "./question-queue.effect";
import { SendMessageToLLMEffect } from "./send-message.effect";
import { UpdatePlanPropertyEffect } from "./update-plan-property.effect";

export const iterativePlanningFeatureEffects = [
    CancelPlanIterationStepEffect,
    ComputeExplanationEffect,
    ComputePlanEffect,
    CreateIterationStepEffect,
    CreateLLMContextEffect,
    CreatePlanPropertyEffect,
    DeleteIterationEffect,
    DeletePlanPropertyEffect,
    IterativePlanningLoadDomainSpecificationEffect,
    LoadIterationStepsEffect,
    LoadPlanPropertiesEffect,
    LoadIterativePlanningProjectEffect,
    QuestionQueueEffect,
    SendMessageToLLMEffect,
    UpdatePlanPropertyEffect
]