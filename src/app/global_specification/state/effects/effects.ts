import { CreateDomainSpecificationEffect } from "./create-domain-spec.effect";
import { CreatePromptsEffect } from "./create-prompts.effect";
import { CreateServicesEffect } from "./create-services.effect";
import { DeleteDomainSpecificationEffect } from "./delete-domain-spec.effect";
import { DeletePromptsEffect } from "./delete-prompts.effect";
import { DeleteServicesEffect } from "./delete-services.effect";
import { LoadDomainSpecificationEffect } from "./load-domain-spec.effect";
import { LoadDomainSpecificationsEffect } from "./load-domain-specs.effect";
import { LoadPromptEffect } from "./load-prompt.effect";
import { LoadPromptsEffect } from "./load-prompts.effect";
import { LoadServicesEffect } from "./load-services.effect";
import { UpdateDomainSpecificationEffect } from "./update-domain-spec.effect";
import { UpdatePromptsEffect } from "./update-prompt.effect";

export const globalSpecFeatureEffects = [
    CreateDomainSpecificationEffect,
    CreatePromptsEffect,
    CreateServicesEffect,
    DeleteDomainSpecificationEffect,
    DeletePromptsEffect,
    DeleteServicesEffect,
    LoadDomainSpecificationEffect,
    LoadDomainSpecificationsEffect,
    LoadPromptEffect,
    LoadPromptsEffect,
    LoadServicesEffect,
    UpdateDomainSpecificationEffect,
    UpdatePromptsEffect,
]