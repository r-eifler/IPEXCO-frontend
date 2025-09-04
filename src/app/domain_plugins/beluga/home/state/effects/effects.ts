import { CreateDefaultPropertiesEffect } from "./create-default-properties.effect";
import { CreatePlanPropertyEffect } from "./create-plan-property.effect";
import { CreateProjectEffect } from "./create-project.effect";
import { DeleteProjectEffect } from "./delete-project.effect";
import { HomeLoadDomainSpecificationsEffect } from "./load-domain-specs.effect";
import { LoadProjectEffect } from "./load-project.effect";
import { LoadProjectsEffect } from "./load-projects.effect";
import { BelugaProjectLoadServicesEffect } from "./load-services.effect";
import { UpdateProjectEffect } from "./update-project.effect";

export const homeEffects = [
    CreateProjectEffect,
    DeleteProjectEffect,
    LoadProjectsEffect,
    HomeLoadDomainSpecificationsEffect,
    LoadProjectEffect,
    CreatePlanPropertyEffect,
    CreateDefaultPropertiesEffect,
    BelugaProjectLoadServicesEffect,
    UpdateProjectEffect,
]