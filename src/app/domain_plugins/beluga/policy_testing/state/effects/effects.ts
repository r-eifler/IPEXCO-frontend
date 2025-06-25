import { CreateTestCollectionEffect } from "./create-test-collections.effect";
import { LoadProjectEffect } from "./load-project.effect";
import { LoadTestCollectionsEffect } from "./load-test-collections.effect";

export const policyTestingEffects = [
    LoadProjectEffect,
    LoadTestCollectionsEffect,
    CreateTestCollectionEffect,
]
