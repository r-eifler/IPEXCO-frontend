import { CancelManualPlanningEffect } from "./cancel-manual-planning.effect";
import { CreateFlightPlanTreeEffect } from "./create-flight-plan-tree.effect";
import { CreateFlightSectionEffect } from "./create-flight-section.effect";
import { FinishManualPlanningEffect } from "./finish-manual-planning.effect";
import { LoadDomainSpecificationEffect } from "./load-domain-spec.effect";
import { LoadFlightPlanTreeEffect } from "./load-flight-plan-tree.effect";
import { LoadFlightSectionsEffect } from "./load-flight-sections.effect";
import { LoadProjectEffect } from "./load-project.effect";
import { LoadServicesEffect } from "./load-services.effect";
import { StartManualPlanningEffect } from "./start-manual-planning.effect";
import { UpdateFlightPlanTreeEffect } from "./update-flight-plan-tree.effect";
import { UpdateFlightSectionEffect } from "./update-flight-section.effect";


export const flightSectionPlanningEffects = [
    LoadProjectEffect,
    LoadServicesEffect,
    LoadDomainSpecificationEffect,
    LoadFlightPlanTreeEffect,
    LoadFlightSectionsEffect,
    CreateFlightPlanTreeEffect,
    CreateFlightSectionEffect,
    UpdateFlightPlanTreeEffect,
    UpdateFlightSectionEffect,
    StartManualPlanningEffect,
    CancelManualPlanningEffect,
    FinishManualPlanningEffect,
]