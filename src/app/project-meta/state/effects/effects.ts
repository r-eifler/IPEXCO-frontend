import { CreateProjectEffect } from "./create-project.effect";
import { DeleteProjectEffect } from "./delete-project.effect";
import { MetaProjectLoadDomainSpecificationsEffect } from "./load-domain-specs.effect";
import { LoadProjectMetaDataListEffect } from "./load-project-meta-list.effect";

export const projectMetaFeatureEffects = [
    CreateProjectEffect,
    DeleteProjectEffect,
    MetaProjectLoadDomainSpecificationsEffect,
    LoadProjectMetaDataListEffect
]