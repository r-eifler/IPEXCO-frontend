import { createSelector } from "@ngrx/store";
import { selectIncomingFlightSchedule, selectIncomingUnloaded, selectJigsState, selectRemainingIncomingJigs } from "../../state/builder.selector";


export const selectNextIncomingJigToUnload = createSelector(selectRemainingIncomingJigs, 
    (remaining) => (remaining?.length ?? 0 >= 0 ? remaining?.[0] : null) ?? null
);

export const selectIncomingJigsStatusSchedule = createSelector(selectIncomingFlightSchedule, selectIncomingUnloaded, selectJigsState, selectRemainingIncomingJigs,
    (schedule, unloaded, jigs, remaining) => schedule?.
        map(e => ({
            jig: jigs?.[e.jig],
            status: {
                skip: e.skip,
                solvability: e.solvabilityStatus,
                unloaded: unloaded?.includes(e.jig),
                next: remaining?.[0]?.name === e.jig
            }
        })).
        filter(e => e.jig !== undefined)
);