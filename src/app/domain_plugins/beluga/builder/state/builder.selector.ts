import { createSelector } from "@ngrx/store";
import { BuilderFeature } from "./builder.feature";
import { BelugaProblemZ, getJigSize, HangarZ, occupiedSpace, Side } from "../../shared/domain/beluga_problem";
import { memoizeWith } from "ramda";


const selectState = BuilderFeature.selectBuilderFeatureState


// Project/Task

export const selectProject = createSelector(selectState, 
    (state) => state.project.data
);

export const selectSightSetUp = createSelector(selectState, 
    (state) => state.sightSetUp
);

export const selectJigTypes= createSelector(selectSightSetUp, 
    (task) => task?.jig_types);

// Sections

export const selectSection = createSelector(selectState, 
    (state) => state.section.data
);


// Units

export const selectSizeUnit = createSelector(BuilderFeature.selectSizeUnit, 
    (unite) => unite);

export const selectMaxPartSize = createSelector(selectSightSetUp, 
    (setup) => setup == undefined ? undefined : Math.max(...Object.values(setup.jig_types).map(jt => jt.size_loaded)));


// Plan

export const selectFinishedPlanSections = createSelector(BuilderFeature.selectPlan, 
    (plan) => plan);

export const selectCurrentPlanSection = createSelector(BuilderFeature.selectCurrentSection, 
    (section) => section);

export const selectCurrentSectionActions = createSelector(selectCurrentPlanSection, 
    (section) => section?.actions);

// Task State

export const selectTaskState = createSelector(BuilderFeature.selectTaskState, 
    (taskState) => taskState);

export const selectJigsState = createSelector(selectTaskState, 
    (taskState) => taskState?.jigs);

// flight

export const selectFlightSchedule= createSelector(selectState, 
    (state) => state.flightsScheduled
);

export const selectCurrentFlightIndex = createSelector(selectTaskState, 
    (taskState) => taskState?.flightIndex);

export const selectIncomingFlightState = createSelector(selectTaskState, 
    (taskState) => taskState?.incomingRemaining);

export const selectIncomingFlightStateJigs = createSelector(selectIncomingFlightState, selectJigsState, 
    (incoming, jigs) => incoming?.map(jn => jigs?.[jn]));

export const selectOutgoingFlightState = createSelector(selectTaskState, 
    (taskState) => taskState?.outgoingLoaded);

export const selectOutgoingFlightStateJigs = createSelector(selectOutgoingFlightState, selectJigsState, 
    (outgoing, jigs) => outgoing?.map(jn => jigs?.[jn]));

export const selectCurrentFlightSchedule = createSelector(selectCurrentFlightIndex, selectFlightSchedule, 
    (flightIndex, flights) => (flightIndex !== null && flightIndex  !== undefined ? 
       flights?.[flightIndex ] : null));

export const selectCurrentOutgoingFlightSchedule = createSelector(selectCurrentFlightSchedule, 
    (schedule) => schedule?.outgoing);

export const selectCurrentFlightName = createSelector(selectCurrentFlightSchedule, 
    (flight) => flight?.name);

export const selectCurrentFlightNextOutgoingJigType = createSelector(selectCurrentFlightSchedule, selectOutgoingFlightState,
    (schedule, outgoing) => {
        if(outgoing === undefined || schedule === undefined  || schedule === null || outgoing.length === schedule.outgoing.length){
            return null;
        }
        let nextTypeIndex = outgoing.length;
        if(nextTypeIndex == undefined){
            return null;
        }
        return schedule.outgoing[nextTypeIndex]
    });

export const selectFlightFinished = createSelector(selectIncomingFlightState, selectOutgoingFlightState, selectCurrentFlightSchedule,
    (incomingState, outgoingState, schedule) => incomingState?.length == 0  && outgoingState?.length == schedule?.outgoing.length
)


// Racks

export const selectRacks = createSelector(selectSightSetUp, 
    (task) => task?.racks)

export const selectRacksState = createSelector(selectTaskState, 
    (taskState) => taskState?.racks)

export const selectRacksStateList = createSelector(selectRacks, selectRacksState, selectJigsState,
    (racks, racksState, jigsState) => racks?.map(r => {
        let jigNames = racksState?.[r.name];
        return {
            ...r,
            jigs: jigNames !== undefined ? jigNames?.map(n => jigsState?.[n]) : [],
        };
    }
));

export const selectRack = memoizeWith(
    (name: string) => name,
    (name: string) => createSelector(selectRacks,
        (racks) => racks?.find(r => r.name === name))
);

export const selectRackState = memoizeWith(
    (name: string) => name,
    (name: string) => createSelector(selectRacksState,
        (racks) => racks?.[name])
);

export const selectFreeSpaceRack = memoizeWith(
    (name: string) => name,
    (name: string) => createSelector(selectRack(name), selectRackState(name), selectJigsState, selectJigTypes,
        (rack, racksState, jigsState, jigTypes) => {
            if(racksState === undefined || jigsState === undefined || jigTypes === undefined || rack === undefined){
                return 0;
            }
            return rack.size - occupiedSpace(racksState, jigsState, jigTypes);
    })
);

// Trailers

export const selectBelugaTrailers = createSelector(selectSightSetUp, 
    (setup) => setup?.belugaTrailers)

export const selectBelugaTrailersState = createSelector(selectTaskState, selectBelugaTrailers,
    (taskState, trailers) => trailers?.reduce((acc,c) => ({...acc, [c.name]: taskState?.trailers[c.name]}), {})
)

export const selectAvailableBelugaTrailers = createSelector(selectBelugaTrailers, selectBelugaTrailersState,
    (trailers, trailersState) => (trailers?.filter(t => trailersState?.[t.name] == null) ?? []));


export const selectFactoryTrailers = createSelector(selectSightSetUp, 
    (setup) => setup?.factoryTrailers)

export const selectFactoryTrailersState = createSelector(selectTaskState, selectFactoryTrailers,
    (taskState, trailers) => trailers?.reduce((acc,c) => ({...acc, [c.name]: taskState?.trailers[c.name]}), {})
)

export const selectAvailableFactoryTrailers = createSelector(selectFactoryTrailers, selectFactoryTrailersState,
    (trailers, trailersState) => (trailers?.filter(t => trailersState?.[t.name] == null) ?? []));

export const selectTrailersStateList = memoizeWith(
    (side: Side) => side,
    (side: Side) => side == 'bside' ? 
    createSelector(selectBelugaTrailers, selectBelugaTrailersState, selectJigsState,
        (trailers, trailersState, jigs) => trailers?.map(t => {
            let jigName = trailersState?.[t.name];
            return {
                ...t,
                jig: jigName !== undefined && jigName !== null ? jigs?.[jigName] : null,
            };
        }
    )) :
    createSelector(selectFactoryTrailers, selectFactoryTrailersState, selectJigsState,
        (trailers, trailersState, jigs) => trailers?.map(t => {
            let jigName = trailersState?.[t.name];
            return {
                ...t,
                jig: jigName !== undefined && jigName !== null ? jigs?.[jigName] : null,
            };
        }
    ))
);

export const selectTrailerState = memoizeWith(
    (name: string) => name,
    (name: string) => createSelector(selectBelugaTrailersState, selectFactoryTrailersState,
        (belugaTrailers, factoryTrailers) => {
            if(belugaTrailers !== undefined && name in belugaTrailers){
                return belugaTrailers[name]
            }
            if(factoryTrailers !== undefined && name in factoryTrailers){
                return factoryTrailers[name]
            }
            return null;
        })
);

export const selectCanDeliver = memoizeWith(
    (name: string) => name,
    (name: string) => createSelector(selectTrailerState(name), selectAvailableHangarNames, selectDeliverableJigs,
        (trailerState, availableHangars, deliverableJigs) => {
            if(trailerState === null || availableHangars?.length == 0){
                return false;
            };
            return trailerState in deliverableJigs;
        })
);

// Hangars 

export const selectHangars = createSelector(selectSightSetUp, 
    (task) => task?.hangars)

export const selectHangarsState = createSelector(selectTaskState, 
    (taskState) => taskState?.hangars)

export const selectHangarState = memoizeWith(
    (name: string) => name,
    (name: string) => createSelector(selectHangarsState,
        (hangars => hangars?.[name])
));

export const selectHangarsStateList = createSelector(selectHangars, selectHangarsState, selectJigsState,
    (hangars, hangarsState, jigsState) => hangars?.map(h => {
        let jigName = hangarsState?.[h.name];
        return {
            ...h,
            jig: jigName !== undefined && jigName !== null ? jigsState?.[jigName] : null,
        };
    }
));

export const selectAvailableHangarNames = createSelector(selectHangars, selectHangarsState,
    (hangars, hangarsState) => (hangars?.filter(h => hangarsState?.[h.name] == null) ?? []))


// ProductionLine 

export const selectProductionLineSchedule = createSelector(selectState, 
    (state) => state.productionLinesScheduled
);

export const selectProductionLinesState = createSelector(selectTaskState, 
    (taskState) => taskState?.productionLines)

export const selectDeliverableJigs = createSelector(selectProductionLinesState, selectProductionLineSchedule,
    (plsState, pls) => {
        if(plsState === undefined || pls === undefined || pls === null){
            return {}
        }
        return pls.reduce((acc,c) => 
            c.schedule.length == 0 ? 
            acc : {...acc, [c.schedule[plsState[c.name].length]]: c.name}, {} as Record<string,string>) 
    });


// Drag & Drop

export const selectDragSource = createSelector(selectState, 
    (state) => (state.dragSource));


export const selectDraggedJig= createSelector(selectState, 
    (state) => (state.draggedJig));

export const selectDraggedSides= createSelector(selectState, 
    (state) => (state.draggedSides));

export const selectDragInProgress= createSelector(selectDraggedJig, 
    (jig) => jig !== null);

export const selectIsDropTargetRack = memoizeWith(
    (name: string) => name,
    (name: string) =>  createSelector(selectDragSource, selectDraggedJig, selectJigsState, selectJigTypes, selectFreeSpaceRack(name),
        (dragSource, draggedJigName, jigs, jigTypes, freeSpace) => {
            if(dragSource?.stageType !== 'trailer' || draggedJigName === null || jigs === undefined){
                return false;
            }
            let jig = jigs[draggedJigName];
            let type = jigTypes?.[jig?.type]
            if(type === undefined){
                return false;
            }
            return getJigSize(jig, type) <= freeSpace;
        }
    )
); 


export const selectIsDropTargetTrailer = memoizeWith(
    (name: string, trailerSide: Side) => name + trailerSide,
    (name: string, trailerSide: Side) =>  createSelector(selectDragSource, selectDraggedJig, selectDraggedSides, selectTrailerState(name),
        (dragSource, draggedJigName, sides, trailerState) => {
            if(!sides?.includes(trailerSide)){
                return false;
            }

            if(trailerSide == 'bside'){
                if((dragSource?.stageType !== 'flight' && dragSource?.stageType !== 'rack') || draggedJigName === null){
                    return false;
                }
                return trailerState === null;
            }
            if(trailerSide == 'fside'){
                if((dragSource?.stageType !== 'hangar' && dragSource?.stageType !== 'rack') || draggedJigName === null){
                    return false;
                }
                return trailerState === null;
            }
        }
    )
); 


export const selectIsDropTargetHangar = memoizeWith(
    (name: string) => name,
    (name: string) =>  createSelector(selectDragSource, selectDraggedJig, selectDraggedSides, selectDeliverableJigs, selectHangarState(name),
        (dragSource, draggedJigName, sides, deliverableJigs, hangarState) => {
            if(!sides?.includes('fside')){
                return false;
            }
            if(dragSource?.stageType !== 'trailer' || draggedJigName === null || ! (draggedJigName in deliverableJigs)){
                return false;
            }
            return hangarState === null;
        }
    )
); 


export const selectIsDropTargetFlightOutgoing = createSelector(selectDragSource, selectDraggedJig, selectDraggedSides, selectCurrentFlightNextOutgoingJigType, selectJigsState,
    (dragSource, draggedJigName, sides, nextType, jigs) => {
        if(!sides?.includes('bside')){
            return false;
        }
        if(dragSource?.stageType !== 'trailer' || draggedJigName === null || jigs === undefined){
            return false;
        }
        return jigs[draggedJigName].empty && nextType === jigs[draggedJigName].type;
    }
);
 



