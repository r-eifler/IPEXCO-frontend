import { CancelPlanComputationEffect } from "./cancel-plan-computation.effect";
import { LoadDomainSpecificationEffect } from "./load-domain-spec.effect";
import { LoadPlanningPlansEffect } from "./load-plans.effect";
import { LoadPlanningProjectEffect } from "./load-project.effect";
import { LoadServicesEffect } from "./load-services.effect";
import { RegisterPlanComputationEffect } from "./register-plan-computation.effect";

export const planningFeatureEffects = [
    LoadPlanningProjectEffect,
    LoadPlanningPlansEffect,
    LoadDomainSpecificationEffect,
    LoadServicesEffect,
    RegisterPlanComputationEffect,
    CancelPlanComputationEffect
]