import { CreateProjectEffect } from "./create-project.effect";
import { DeleteProjectEffect } from "./delete-project.effect";
import { HomeLoadDomainSpecificationsEffect } from "./load-domain-specs.effect";
import { LoadProjectsEffect } from "./load-projects.effect";

export const homeEffects = [
    CreateProjectEffect,
    DeleteProjectEffect,
    LoadProjectsEffect,
    HomeLoadDomainSpecificationsEffect
]