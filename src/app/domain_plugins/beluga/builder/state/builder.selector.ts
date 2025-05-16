import { createSelector } from "@ngrx/store";
import { memoizeWith } from "ramda";
import { getJigSize, occupiedRackSpace, Side } from "../../shared/domain/beluga_problem";
import { BuilderFeature, selectFlights } from "./builder.feature";


const selectState = BuilderFeature.selectBuilderFeatureState


// Sections

export const selectSection = createSelector(selectState, 
    (state) => state.section.data
);


// Project/Task

export const selectProject = createSelector(selectState, 
    (state) => state.project.data
);

export const selectAllFlights = createSelector(selectFlights, 
    (flights) => flights.data
);

export const selectSiteSetUp = createSelector(selectSection, 
    (section) => section === undefined ? undefined : section.configurations[section.configurationIndex].siteSetUp
);

export const selectJigTypes= createSelector(selectSiteSetUp, 
    (siteSetUp) => siteSetUp?.jig_types);

// Units

export const selectSizeUnit = createSelector(BuilderFeature.selectSizeUnit, 
    (unite) => unite);

export const selectMaxPartSize = createSelector(selectSiteSetUp, 
    (setup) => setup == undefined ? undefined : Math.max(...Object.values(setup.jig_types).map(jt => jt.size_loaded)));


// Plan

export const selectCurrentPlanSection = createSelector(BuilderFeature.selectSection, 
    (section) => section);

export const selectActions = createSelector(selectSection, 
    (section) => section?.actions);

// Task State

export const selectTaskState = createSelector(BuilderFeature.selectTaskState, 
    (taskState) => taskState);

export const selectJigsState = createSelector(selectTaskState, 
    (taskState) => taskState?.jigs);


//##########################################
// flight

export const selectFlightSchedule= createSelector(selectSection, 
    (section) => section === undefined ? undefined : section.configurations[section.configurationIndex].flightTargetSchedule);

export const selectFlightName = createSelector(selectFlightSchedule, 
    (flight) => flight?.name);
    

// Incoming

export const selectIncomingFlightSchedule= createSelector(selectFlightSchedule, 
    (schedule) => schedule?.incoming);

export const selectIncomingUnloaded = createSelector(selectTaskState, 
    (taskState) => taskState?.incomingUnloaded);

export const selectRemainingIncomingJigs = createSelector(selectIncomingFlightSchedule, selectIncomingUnloaded, selectJigsState,
    (schedule, unloaded, jigs) => schedule?.
        filter(e => !e.skip && ! unloaded?.includes(e.jig)).
        map(e => jigs?.[e.jig]).
        filter(j => j !== undefined)
);
 
export const selectIncomingUnloadFinished = createSelector(selectRemainingIncomingJigs, 
    (remaining) => remaining?.length == 0);

// Outgoing

export const selectOutgoingFlightSchedule= createSelector(selectFlightSchedule, 
    (schedule) => schedule?.outgoing);

export const selectOutgoingLoaded = createSelector(selectTaskState, 
    (taskState) => taskState?.outgoingLoaded);

export const selectOutgoingLoadedJigs = createSelector(selectOutgoingLoaded, selectJigsState,
    (loaded, jigs) => loaded?.map(jn => jigs?.[jn]).filter(j => j !== undefined));

export const selectRemainingOutgoingJigTypes = createSelector(selectOutgoingFlightSchedule, selectOutgoingLoaded,
    (schedule, loaded) => {
        const considered = schedule?.filter(e => !e.skip);
        if(considered === undefined){
            return undefined;
        }
        return considered.slice(loaded?.length).map(e => e.jigType)
    }
);

export const selectOutgoingLoadFinished = createSelector(selectRemainingOutgoingJigTypes, 
    (remaining) => remaining?.length == 0);

export const selectCurrentFlightNextOutgoingJigType = createSelector(selectFlightSchedule, selectOutgoingLoaded,
    (schedule, outgoing) => {
        if(outgoing === undefined || schedule === undefined  || schedule === null){
            return null;
        }
        let hardGoalsOutgoing = schedule.outgoing.filter(j => !j.skip)
        let nextTypeIndex = outgoing.length;
        if(nextTypeIndex == undefined || hardGoalsOutgoing.length === nextTypeIndex){
            return null;
        }
        return schedule.outgoing[nextTypeIndex].jigType
    });


// general

export const selectFlightFinished = createSelector(selectIncomingUnloadFinished, selectOutgoingLoadFinished,
    (incomingFinished, outgoingFinished) => incomingFinished && outgoingFinished
)

export const selectJigMapIncomingFlight= createSelector(selectAllFlights, 
    (flights) => flights?.reduce((acc1,c1) => ({
        ...acc1,
        ...c1.incoming.reduce((acc2,c2) =>({...acc2, [c2]: c1.name}), {})
    }), {})
);


// Racks

export const selectRacks = createSelector(selectSiteSetUp, 
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
            return rack.size - occupiedRackSpace(racksState, jigsState, jigTypes);
    })
);

// Trailers

export const selectBelugaTrailers = createSelector(selectSiteSetUp, 
    (setup) => setup?.belugaTrailers)

export const selectBelugaTrailersState = createSelector(selectTaskState, selectBelugaTrailers,
    (taskState, trailers) => trailers?.reduce((acc,c) => ({...acc, [c.name]: taskState?.trailers[c.name]}), {})
)

export const selectAvailableBelugaTrailers = createSelector(selectBelugaTrailers, selectBelugaTrailersState,
    (trailers, trailersState) => (trailers?.filter(t => trailersState?.[t.name] == null) ?? []));


export const selectFactoryTrailers = createSelector(selectSiteSetUp, 
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

export const selectHangars = createSelector(selectSiteSetUp, 
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

export const selectProductionLineSchedule = createSelector(selectSection, 
    (section) => section === undefined ? undefined : section.configurations[section.configurationIndex].productionLinesTargetSchedule
);

export const selectProductionLineScheduleFor = memoizeWith(
    (name: string) => name,
    (name: string) =>  createSelector(selectProductionLineSchedule,
        (targetSchedules) => targetSchedules?.find(pl => pl.name == name)
    )
); 

export const selectProductionLinesState = createSelector(selectTaskState, 
    (taskState) => taskState?.productionLines)

export const selectProductionLinesStateFor = memoizeWith(
    (name: string) => name,
    (name: string) =>  createSelector(selectProductionLinesState,
        (deliveryState) => deliveryState?.[name]
    )
); 

export const selectDeliverableJigs = createSelector(selectProductionLineSchedule, selectProductionLinesState,
    (pls, delivered) => {
        if(pls === undefined || pls === null || delivered === undefined){
            return []
        }
        return pls.reduce((acc, pl) => (
            {
                ...acc, 
                [pl.schedule.find(e => !e.skip && !delivered[pl.name].includes(e.jig))?.jig ?? 'none']: pl.name
            }), {} as Record<string, string>
        )
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
 



