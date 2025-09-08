import { createSelector } from "@ngrx/store";
import { BelugaGoalType } from "../../../shared/domain/properties";
import { selectSelectedConfiguration, selectUsedConfiguration } from "../../state/flight-section-planning.selector";



export const selectConflicts= createSelector(selectSelectedConfiguration, 
    (configuration) => configuration?.explanations?.MUGS.
    flatMap(cn => cn.map(g => configuration?.explanations?.goals[g])).
    filter(g => g !== undefined)
);


export const selectIncomingFlightConflictMembers= createSelector(selectConflicts, 
    (conflicts) => conflicts?.filter(g => g.definition?.name == BelugaGoalType.UNLOAD_BELUGA).
    map(g => ({
        jigName: g.definition.parameters[0],
        flightName: g.definition.parameters[1],
        position:  parseInt(g.definition.parameters[2])
    }))
);

export const selectOutgoingFlightConflictMembersRelativePosition= createSelector(selectConflicts, 
    (conflicts) => conflicts?.filter(g => g.definition?.name == BelugaGoalType.LOAD_BELUGA).
    map(g => ({
        jigType: g.definition.parameters[0],
        flightName: g.definition.parameters[1],
        position:  parseInt(g.definition.parameters[2])
    }))
);

export const selectOutgoingFlightConflictMembers= createSelector(selectOutgoingFlightConflictMembersRelativePosition, selectSelectedConfiguration,
    (members, config) => {
        if(members === undefined || config === undefined){
            return undefined;
        }
        const indexMapFlights = Object.values(config.flightTargetSchedule).reduce((acc, flight) => {
            let skippedIdList = flight.outgoing?.map((e,index) => ({skip: e.skip, index})).filter(e => !e.skip);
            let indexMap = skippedIdList?.reduce((acc,c,index) => ({...acc,[index]: c.index}), {});
            return {
                ...acc, 
                [flight.name]: indexMap
            }}, {});
        if(indexMapFlights === undefined){
            return undefined;
        }
        return members.map(m => ({...m, position: indexMapFlights[m.flightName][m.position]}))
    }
);

export const selectProductionConflictMembers= createSelector(selectConflicts, 
    (conflicts) => conflicts?.filter(g => g.definition?.name == BelugaGoalType.DELIVER_TO_PRODUCTION_LINE).
    map(g => ({
        jigName: g.definition.parameters[0],
        productionLineName: g.definition.parameters[1],
        position:  g.definition.parameters[1],
    }))
);

export const selectSwapsConflictMembers= createSelector(selectConflicts, 
    (conflicts) => conflicts?.filter(g => g.definition?.name == BelugaGoalType.NUM_SWAPS_USED_LEQ).
    map(g => ({
        numSwaps: parseInt(g.definition.parameters[0])
    }))
);

export const selectHasEmptyRackConflictMember= createSelector(selectConflicts, 
    (conflicts) => {
        const members = conflicts?.filter(g => g.definition?.name == BelugaGoalType.AT_LEAST_ONE_RACK_ALWAYS_EMPTY);
        return (members?.length ?? 0) > 0
});

export const selectRackMaintenanceConflictMembers= createSelector(selectConflicts, 
    (conflicts) => conflicts?.filter(g => g.definition?.name == BelugaGoalType.RACK_MAINTENANCE).
    map(g => ({
        rackName: g.definition.parameters[0]
    }))
);

export const selectTrailerMaintenanceConflictMembers= createSelector(selectConflicts, 
    (conflicts) => conflicts?.filter(g => g.definition?.name == BelugaGoalType.TRAILER_MAINTENANCE).
    map(g => ({
        trailerName: g.definition.parameters[0]
    }))
);