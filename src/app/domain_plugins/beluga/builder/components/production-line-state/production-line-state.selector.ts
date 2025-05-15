import { createSelector } from "@ngrx/store";
import { memoizeWith } from "ramda";
import { selectJigsState, selectProductionLineScheduleFor, selectProductionLinesStateFor } from "../../state/builder.selector";

export const selectProductionLinesStatusSchedule = memoizeWith(
    (name: string) => name,
    (name: string) =>  createSelector(selectProductionLineScheduleFor(name), selectProductionLinesStateFor(name), selectJigsState,
        (targetSchedule, delivered, jigs) => {
            if(targetSchedule === undefined){
              return undefined;
            }
            const schedule = targetSchedule.schedule.map(e => ({
              jig: jigs?.[e.jig],
              status: {
                  skip: e.skip,
                  onSite: e.onSite,
                  delivered: delivered?.includes(e.jig) ?? false,
                  next: false,
              }
            }));

            const indexNext = schedule.findIndex(e => !e.status.skip && !e.status.delivered)
            if(indexNext !== -1){
              schedule[indexNext].status.next = true;
            }
            return schedule;
      }
    )
); 

export const selectProductionLineNextJigName = memoizeWith(
    (name: string) => name,
    (name: string) =>  createSelector(selectProductionLinesStatusSchedule(name),
        (statusSchedule) => statusSchedule?.find(e => e.status.next)?.jig?.name ?? null
    )
); 