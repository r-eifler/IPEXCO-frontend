import { UndoStackEffect } from "src/app/shared/state/undo/undo-stack.effect";
import { CancelManualPlanningEffect } from "./cancel-manual-planning.effect";
import { FinishManualPlanningEffect } from "./finish-manual-planning.effect";
import { LoadFlightSectionEffect } from "./load-flight-sections.effect";
import { LoadProjectEffect } from "./load-project.effect";
import { ReturnFromManualPlanningEffect } from "./return-from-manual-planning.effect";
import { UpdateFlightSectionEffect } from "./update-flight-section.effect";

export const builderEffects = [
    LoadProjectEffect,
    LoadFlightSectionEffect,

    UpdateFlightSectionEffect,

    FinishManualPlanningEffect,
    CancelManualPlanningEffect,
    ReturnFromManualPlanningEffect,

    UndoStackEffect,
]
