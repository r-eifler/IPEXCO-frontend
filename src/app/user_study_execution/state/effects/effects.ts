import { UserStudyCanceledEffect } from "./canceled.effect";
import { FinishUserStudyEffect } from "./finish-user-study.effect";
import { UserStudyFinishedAllStepsEffect } from "./finished-all-steps.effect copy";
import { LoadUserStudyExecutionDemoEffect } from "./load-demo.effect";
import { LoadUserStudyExecutionPlanPropertiesEffect } from "./load-plan-properties.effect";
import { ExecutionLoadUserStudyEffect } from "./load-user-study.effect";
import { LogUserActivitiesEffect } from "./log-user-activities.effect";
import { RegisterUserStudyEffect } from "./register-user-study.effect";
import { RedirectToNextUserStudyEffect } from "./select-user-study.effect";

export const userStudyExecutionFeatureEffects = [
    UserStudyCanceledEffect,
    FinishUserStudyEffect,
    UserStudyFinishedAllStepsEffect,
    LoadUserStudyExecutionDemoEffect,
    LoadUserStudyExecutionPlanPropertiesEffect,
    ExecutionLoadUserStudyEffect,
    LogUserActivitiesEffect,
    RedirectToNextUserStudyEffect,
    RegisterUserStudyEffect
]