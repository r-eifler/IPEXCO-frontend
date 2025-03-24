import { CancelCreateDemoEffect } from "./cancel-create-demo.effect";
import { CreateDemoEffect } from "./create-demo.effect";
import { DeleteProjectDemoEffect } from "./delete-demo.effect";
import { LoadDemoProjectPlanPropertiesEffect } from "./load-demo-plan-properties.effect";
import { LoadProjectDemosEffect } from "./load-demos.effect";
import { ProjectLoadDomainSpecificationEffect } from "./load-domain-spec.effect";
import { LoadProjectPlanPropertiesEffect } from "./load-plan-properties.effect";
import { LoadProjectEffect } from "./load-project.effect";
import { ProjectLoadPromptsEffect } from "./load-prompts.effect";
import { ProjectLoadServicesEffect } from "./load-services.effect";
import { UpdateDemoEffect } from "./update-demo.effect";
import { ProjectDemoUpdatePlanPropertyEffect } from "./update-plan-property.effect";
import { UpdateProjectEffect } from "./update-project.effect";

export const projectFeatureEffects = [
    CancelCreateDemoEffect,
    CreateDemoEffect,
    DeleteProjectDemoEffect,
    LoadDemoProjectPlanPropertiesEffect,
    LoadProjectDemosEffect,
    ProjectLoadDomainSpecificationEffect,
    LoadProjectPlanPropertiesEffect,
    LoadProjectEffect,
    ProjectLoadPromptsEffect,
    ProjectLoadServicesEffect,
    UpdateDemoEffect,
    ProjectDemoUpdatePlanPropertyEffect,
    UpdateProjectEffect
]