import { CreateFlightPlanTreeEffect } from "./create-flight-plan-tree.effect";
import { CreateFlightSectionEffect } from "./create-flight-section.effect";
import { LoadFlightPlanTreeEffect } from "./load-flight-plan-tree.effect";
import { LoadFlightSectionsEffect } from "./load-flight-sections.effect";
import { LoadProjectEffect } from "./load-project.effect";
import { UpdateFlightPlanTreeEffect } from "./update-flight-plan-tree.effect";
import { UpdateFlightSectionEffect } from "./update-flight-section.effect";


export const flightSectionPlanningEffects = [
    LoadProjectEffect,
    LoadFlightPlanTreeEffect,
    LoadFlightSectionsEffect,
    CreateFlightPlanTreeEffect,
    CreateFlightSectionEffect,
    UpdateFlightPlanTreeEffect,
    UpdateFlightSectionEffect,
]