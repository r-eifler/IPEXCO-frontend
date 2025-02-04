import { AcceptUserStudyParticipantEffect } from "./accept-participant.effect";
import { CreateUserStudyParticipantDistributionEffect } from "./create-user-study-participant-distribution.effect";
import { CreateUserStudyEffect } from "./create-user-study.effect";
import { EditUserStudyParticipantDistributionEffect } from "./edit-user-study-participant-distribution.effect ";
import { EditUserStudyEffect } from "./edit-user-study.effect";
import { LoadUserStudyDemosEffect } from "./load-demos.effect";
import { LoadUserStudiesEffect } from "./load-user-studies.effect";
import { LoadUserStudyDistributionEffect } from "./load-user-study-participant-distribution.effect";
import { LoadUserStudyDistributionsEffect } from "./load-user-study-participant-distributions.effect";
import { LoadUserStudyParticipantsEffect } from "./load-user-study-participants.effect";
import { LoadUserStudyEffect } from "./load-user-study.effect";

export const userStudyFeatureEffects = [
    AcceptUserStudyParticipantEffect,
    CreateUserStudyParticipantDistributionEffect,
    CreateUserStudyEffect,
    EditUserStudyParticipantDistributionEffect,
    EditUserStudyEffect,
    LoadUserStudyDemosEffect,
    LoadUserStudiesEffect,
    LoadUserStudyDistributionEffect,
    LoadUserStudyDistributionsEffect,
    LoadUserStudyParticipantsEffect,
    LoadUserStudyEffect
]