import { CreateTestCollectionEffect } from "./create-test-collections.effect";
import { LoadFlightPlanTreeEffect } from "./load-flight-plan-tree.effect";
import { LoadFlightSectionsEffect } from "./load-flight-sections.effect";
import { LoadProjectEffect } from "./load-project.effect";
import { LoadTestCollectionsEffect } from "./load-test-collections.effect";
import { ResetTestCollectionEffect } from "./reset-test-collections.effect";
import { StartTestStateFuzzingEffect } from "./start-fuzzing.effect";

export const policyTestingEffects = [
    LoadProjectEffect,
    LoadTestCollectionsEffect,
    CreateTestCollectionEffect,
    StartTestStateFuzzingEffect,
    LoadFlightSectionsEffect,
    LoadFlightPlanTreeEffect,
    ResetTestCollectionEffect,
]
