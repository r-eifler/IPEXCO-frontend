import { createSelector } from "@ngrx/store";
import { selectJigsState, selectJigTypes, selectOutgoingFlightSchedule, selectOutgoingLoaded, selectRemainingOutgoingJigTypes } from "../../state/builder.selector";
import { truncate } from "fs";

export const selectNextOutgoingJigTypeToLoad = createSelector(selectRemainingOutgoingJigTypes, 
    (remaining) => (remaining?.length ?? 0 >= 0 ? remaining?.[0] : null) ?? null
);

export const selectOutGoingStatusSchedule = createSelector(selectOutgoingFlightSchedule, selectOutgoingLoaded, selectJigsState, selectJigTypes,
    (schedule, loadedJigs, jigs, jigTypes) => {
      if(loadedJigs === undefined){
        return undefined;
      }
      let loadedIndex = 0;
      let nextFound = false;
      return schedule?.
        map(e => {
            const loaded = !e.skip && loadedIndex < loadedJigs.length
            const elem = {
              //TODO check whether types match
              jig:  !loaded ? null : jigs?.[loadedJigs[loadedIndex]],
              type: jigTypes?.[e.jigType],
              status: {
                  skip: e.skip,
                  loaded,
                  next: !e.skip && loadedIndex == loadedJigs.length && !nextFound
              }
            }
            if(loaded){
              loadedIndex++;
            }
            if(elem.status.next){
              nextFound = true;
            }
            return elem
        })
});

export const selectNextOutgoingJigTypeIndex = createSelector(selectOutGoingStatusSchedule, 
  (statusSchedule) => statusSchedule?.findIndex(e => e.status.next)
);
