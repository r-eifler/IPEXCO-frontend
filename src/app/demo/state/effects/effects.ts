import { LoadDemoPlanPropertiesEffect } from "./load-demo-plan-properties.effect";
import { LoadDemoEffect } from "./load-demo.effect";
import { LoadDemosEffect } from "./load-demos.effect";
import { DemoLoadDomainSpecificationEffect } from "./load-domain-spec.effect";
import { DemoLoadPromptsEffect } from "./load-prompts.effect";
import { DemoLoadServicesEffect } from "./load-services.effect";
import { DemosUpdateDemoEffect } from "./update-demo.effect";
import { DemoDemoUpdatePlanPropertyEffect } from "./update-plan-property.effect";
import { UploadDemoEffect } from "./upload-demo.effect";

export const demosFeatureEffects = [
    LoadDemoPlanPropertiesEffect,
    LoadDemoEffect,
    LoadDemosEffect,
    DemoLoadPromptsEffect,
    DemoLoadServicesEffect,
    DemosUpdateDemoEffect,
    DemoDemoUpdatePlanPropertyEffect,
    UploadDemoEffect,
    DemoLoadDomainSpecificationEffect
]