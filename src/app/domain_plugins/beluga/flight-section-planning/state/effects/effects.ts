
import { CancelAutomaticPlanningEffect } from "./cancel-automatic-planning.effect";
import { CancelPlanningEffect } from "./cancel-planning.effect";
import { CreateFlightPlanTreeBranchEffect } from "./create-branch.effect";
import { CreateFlightPlanTreeEffect } from "./create-flight-plan-tree.effect";
import { CreateFlightSectionEffect } from "./create-flight-section.effect";
import { GoToConfigurationUpdateEffect } from "./go-to-configuration-update.effect";
import { LoadDomainSpecificationEffect } from "./load-domain-spec.effect";
import { LoadFlightPlanTreeEffect } from "./load-flight-plan-tree.effect";
import { LoadFlightSectionsEffect } from "./load-flight-sections.effect";
import { LoadProjectEffect } from "./load-project.effect";
import { LoadServicesEffect } from "./load-services.effect";
import { RegisterManualPlanningEffect } from "./register-manual-planning.effect";
import { StartAutomaticPlanningEffect } from "./start-automatic-plannig.effect";
import { StartExplanationEffect } from "./start-explanations.effect";
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
    CreateFlightPlanTreeBranchEffect,
    
    UpdateFlightPlanTreeEffect,
    UpdateFlightSectionEffect,

    RegisterManualPlanningEffect,
    StartManualPlanningEffect,
    CreateFlightSectionEffect,
    StartAutomaticPlanningEffect,

    StartExplanationEffect,

    GoToConfigurationUpdateEffect,

    CancelAutomaticPlanningEffect,
    CancelPlanningEffect
]