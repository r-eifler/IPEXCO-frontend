import { createSelector } from "@ngrx/store";
import { BuilderFeature } from "./builder.feature";
import { BelugaProblemZ, getJigSize, HangarZ, occupiedSpace, Side } from "../../shared/domain/beluga_problem";
import { memoizeWith } from "ramda";


const selectState = BuilderFeature.selectBuilderFeatureState


// Project/Task

export const selectProject = createSelector(selectState, 
    (state) => (state.project.data));

export const selectTask = createSelector(selectState, 
    (state) => (state.project.data?.baseTask?.model != null ? 
    BelugaProblemZ.parse(state.project.data?.baseTask?.model) : null)
);

export const selectJigTypes= createSelector(selectTask, 
    (task) => task?.jig_types);

// Units

export const selectSizeUnit = createSelector(BuilderFeature.selectSizeUnit, 
    (unite) => unite);

export const selectMaxPartSize = createSelector(selectTask, 
    (task) => task == undefined ? undefined : Math.max(...Object.values(task.jig_types).map(jt => jt.size_loaded)));


// Plan

export const selectCurrentPlanSection = createSelector(BuilderFeature.selectCurrentSection, 
    (section) => section);


// Task State

export const selectTaskState = createSelector(BuilderFeature.selectTaskState, 
    (taskState) => taskState);

export const selectJigsState = createSelector(selectTaskState, 
    (taskState) => taskState?.jigs);

export const selectIncomingFlightState = createSelector(selectTaskState, 
    (taskState) => taskState?.incoming);

export const selectOutgoingFlightState = createSelector(selectTaskState, 
    (taskState) => taskState?.outgoing);

// flight

export const selectCurrentFlightIndex = createSelector(selectTaskState, 
    (taskState) => taskState?.flightIndex);

export const selectCurrentFlightSchedule = createSelector(selectCurrentFlightIndex, selectTask, 
    (flightIndex, task) => (flightIndex !== null && flightIndex  !== undefined ? 
        task?.flights[flightIndex ] : null));

export const selectCurrentFlightName = createSelector(selectCurrentFlightSchedule, 
    (flight) => flight?.name);

export const selectCurrentFlightNextOutgoing = createSelector(selectCurrentFlightSchedule, selectOutgoingFlightState,
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

export const selectRacks = createSelector(selectTask, 
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

export const selectBelugaTrailers = createSelector(selectTask, 
    (task) => task?.trailers_beluga)

export const selectBelugaTrailersState = createSelector(selectTaskState, 
    (taskState) => taskState?.trailersBeluga)

export const selectAvailableBelugaTrailers = createSelector(selectBelugaTrailers, selectBelugaTrailersState,
    (trailers, trailersState) => (trailers?.filter(t => trailersState?.[t.name] == null) ?? []));


export const selectFactoryTrailers = createSelector(selectTask, 
    (task) => task?.trailers_factory)

export const selectFactoryTrailersState = createSelector(selectTaskState, 
    (taskState) => taskState?.trailersFactory)

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

// Hangars 

export const selectHangars = createSelector(selectTask, 
    (task) => task?.hangars.map(name => HangarZ.parse({name})))

export const selectHangarsState = createSelector(selectTaskState, 
    (taskState) => taskState?.hangars)

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

export const selectProductionLines = createSelector(selectTask, 
    (task) => task?.production_lines)

export const selectProductionLinesState = createSelector(selectTaskState, 
    (taskState) => taskState?.productionLines)

export const selectDeliverableJigs = createSelector(selectProductionLinesState,
    (selectProductionLinesState) => {
        if(selectProductionLinesState == undefined){
            return {}
        }
        let productionLinesList = Object.values(selectProductionLinesState);
        return productionLinesList.reduce((acc,c) => 
            c.schedule.length == 0 ? 
            acc : {...acc, [c.schedule[0]]: c.name}, {}) as Record<string,string>
    });


// Drag & Drop

export const selectDragSource = createSelector(selectState, 
    (state) => (state.dragSource));


export const selectDraggedJig= createSelector(selectState, 
    (state) => (state.draggedJig));


export const selectDragInProgress= createSelector(selectDraggedJig, 
    (jig) => jig !== null);

export const selectIsDropTargetRack = memoizeWith(
    (name: string) => name,
    (name: string) =>  createSelector(selectDragSource, selectDraggedJig, selectJigsState, selectJigTypes, selectFreeSpaceRack(name),
        (dragSource, draggedJigName, jigs, jigTypes, freeSpace) => {
            console.log(freeSpace);
            if(dragSource?.stageType == 'rack' || draggedJigName === null || jigs === undefined){
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
    (name: string) => name,
    (name: string) =>  createSelector(selectDragSource, selectDraggedJig, selectTrailerState(name),
        (dragSource, draggedJigName, trailerState) => {
            if(dragSource?.stageType == 'trailer' || draggedJigName === null){
                return false;
            }
            return trailerState === null;
        }
    )
); 


