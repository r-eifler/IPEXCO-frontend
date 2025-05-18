import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Action, Store } from '@ngrx/store';
import { switchMap } from 'rxjs/operators';
import { automaticPlanningFinishedSuccess, cancelConfigurationUpdate, createFlightSectionSuccess, explanationsFinishedSuccess, inspectConfig, inspectPlan, newConfiguration, registerManualPlanning, saveConfiguration, skipIncomingJig, skipOutgoingJigType, skipProductionJig, startAutomaticPlanning, startExplanations, stopInspectPlan, updateConfigurationOfSectionAndConfigIndex, updateEmptyRacks, updateHangarStatus, updateMaxSwaps, updateRackStatus, updateTrailerStatus } from 'src/app/domain_plugins/beluga/flight-section-planning/state/flight-section-planning.actions';
import { selectSelectedConfigIndex } from 'src/app/domain_plugins/beluga/flight-section-planning/state/flight-section-planning.feature';
import { selectSelectedSection, selectUpdatingConfiguration } from 'src/app/domain_plugins/beluga/flight-section-planning/state/flight-section-planning.selector';
import { ActionType } from '../../domain/user-action';
import { logAction } from '../user-study-execution.actions';
import { cancelManualPlanning, createNewBelugaAction, skipIncomingJig as builderSkipIncomingJig, skipOutgoingJigType as builderSkipOutgoingJigType, skipProductionJig as builderSkipProductionJig } from 'src/app/domain_plugins/beluga/builder/state/builder.actions';
import { undoAction } from 'src/app/shared/state/undo/handle-undo';
import { of } from 'ramda';
import { BelugaAction } from 'src/app/domain_plugins/beluga/shared/domain/beluga_plan';


@Injectable()
export class LogUserActivitiesBelugaEffect{

    private actions$ = inject(Actions);
    private store = inject(Store);

    public nextFlightSection$ = createEffect(() => this.actions$.pipe(
        ofType(createFlightSectionSuccess),
        switchMap(({section}) => [
            logAction({action: {
                type: ActionType.NEXT_FLIGHT_SECTION, 
                data: {
                    section
                }
            }})
        ])
    ));


    public inspectPlan$ = createEffect(() => this.actions$.pipe(
        ofType(inspectPlan),
        switchMap(({sectionId}) => [
            logAction({action: {
                type: ActionType.START_INSPECT_PLAN, 
                data: {
                    sectionId
                }
            }})
        ])
    ));


    public stopInspectPlan$ = createEffect(() => this.actions$.pipe(
        ofType(stopInspectPlan),
        switchMap(({sectionId}) => [
            logAction({action: {
                type: ActionType.STOP_INSPECT_PLAN, 
                data: {
                    sectionId
                }
            }})
        ])
    ));

    public callPlanner$ = createEffect(() => this.actions$.pipe(
        ofType(startAutomaticPlanning),
        switchMap(({section}) => [
            logAction({action: {
                type: ActionType.CALL_PLANNER, 
                data: {
                    sectionId: section._id
                }
            }})
        ])
    ));

    public resultsPlanner$ = createEffect(() => this.actions$.pipe(
        ofType(automaticPlanningFinishedSuccess),
        switchMap(({id}) => [
            logAction({action: {
                type: ActionType.GET_PLANNER_RESULT, 
                data: {
                    sectionId: id
                }
            }})
        ])
    ));

     public newConfiguration$ = createEffect(() => this.actions$.pipe(
        ofType(newConfiguration),
        concatLatestFrom(() => this.store.select(selectSelectedSection)),
        switchMap(([_, section ]) => [
            logAction({action: {
                type: ActionType.START_NEW_CONFIGURATION, 
                data: {
                    sectionId: section?._id,
                    baseConfigIndex: section?.configurationIndex,
                }
            }})
        ])
    ));

    public newConfigurationFromIndex$ = createEffect(() => this.actions$.pipe(
        ofType(updateConfigurationOfSectionAndConfigIndex),
        switchMap(({section , index}) => [
            logAction({action: {
                type: ActionType.START_NEW_CONFIGURATION, 
                data: {
                    sectionId: section?._id,
                    baseConfigIndex: index,
                }
            }})
        ])
    ));

    public updateConfigIncomingAction$ = createEffect(() => this.actions$.pipe(
        ofType(skipIncomingJig),
        switchMap(({index, skip}) => [
            logAction({action: {
                type: ActionType.UPDATE_CONFIGURATION, 
                data: {
                    type: 'incoming',
                    index,
                    value: skip,
                }
            }})
        ])
    ));

    public updateConfigOutgoingAction$ = createEffect(() => this.actions$.pipe(
        ofType(skipOutgoingJigType),
        switchMap(({index, skip}) => [
            logAction({action: {
                type: ActionType.UPDATE_CONFIGURATION, 
                data: {
                    type: 'outgoing',
                    index,
                    value: skip,
                }
            }})
        ])
    ));

    public updateConfigProductionAction$ = createEffect(() => this.actions$.pipe(
        ofType(skipProductionJig),
        switchMap(({productionLineName, index, skip}) => [
            logAction({action: {
                type: ActionType.UPDATE_CONFIGURATION, 
                data: {
                    type: 'production',
                    name: productionLineName,
                    index,
                    value: skip,
                }
            }})
        ])
    ));

    public updateConfigRackAction$ = createEffect(() => this.actions$.pipe(
        ofType(updateRackStatus),
        switchMap(({index, status}) => [
            logAction({action: {
                type: ActionType.UPDATE_CONFIGURATION, 
                data: {
                    type: 'rack',
                    index,
                    value: status,
                }
            }})
        ])
    ));

    public updateConfigTrailerAction$ = createEffect(() => this.actions$.pipe(
        ofType(updateTrailerStatus),
        switchMap(({index, status}) => [
            logAction({action: {
                type: ActionType.UPDATE_CONFIGURATION, 
                data: {
                    type: 'trailer',
                    index,
                    value: status,
                }
            }})
        ])
    ));

    public updateConfigHangarAction$ = createEffect(() => this.actions$.pipe(
        ofType(updateHangarStatus),
        switchMap(({index, status}) => [
            logAction({action: {
                type: ActionType.UPDATE_CONFIGURATION, 
                data: {
                    type: 'hangar',
                    index,
                    value: status,
                }
            }})
        ])
    ));

    public updateConfigSwapsAction$ = createEffect(() => this.actions$.pipe(
        ofType(updateMaxSwaps),
        switchMap(({value}) => [
            logAction({action: {
                type: ActionType.UPDATE_CONFIGURATION, 
                data: {
                    type: 'swaps',
                    value,
                }
            }})
        ])
    ));

    public updateConfigRacksEmptyAction$ = createEffect(() => this.actions$.pipe(
        ofType(updateEmptyRacks),
        switchMap(({value}) => [
            logAction({action: {
                type: ActionType.UPDATE_CONFIGURATION, 
                data: {
                    type: 'rack_empty',
                    value,
                }
            }})
        ])
    ));

    public finishUpdateConfigAction$ = createEffect(() => this.actions$.pipe(
        ofType(saveConfiguration),
        concatLatestFrom(() => [
            this.store.select(selectSelectedSection),
            this.store.select(selectSelectedConfigIndex),
            this.store.select(selectUpdatingConfiguration),
        ]),
        switchMap(([_, section, baseConfigIndex, newConfig]) => [
            logAction({action: {
                type: ActionType.FINISH_NEW_CONFIGURATION, 
                data: {
                    sectionId: section?._id,
                    baseConfigIndex,
                    newConfigIndex: section?.configurationIndex == undefined ? undefined : section?.configurationIndex + 1,
                    newConfig,
                }
            }})
        ])
    ));

    public cancelUpdateConfigAction$ = createEffect(() => this.actions$.pipe(
        ofType(cancelConfigurationUpdate),
        concatLatestFrom(() => [
            this.store.select(selectSelectedSection),
            this.store.select(selectSelectedConfigIndex),
        ]),
        switchMap(([_, section, baseConfigIndex]) => [
            logAction({action: {
                type: ActionType.CANCEL_NEW_CONFIGURATION, 
                data: {
                    sectionId: section?._id,
                    baseConfigIndex,
                }
            }})
        ])
    ));


    public requestExpAction$ = createEffect(() => this.actions$.pipe(
        ofType(startExplanations),
        concatLatestFrom(() => this.store.select(selectSelectedConfigIndex)),
        switchMap(([{section}, configIndex]) => [
            logAction({action: {
                type: ActionType.REQUEST_UNSOLVABLE_EXPLANATION, 
                data: {
                    sectionId: section._id,
                    configIndex,
                }
            }})
        ])
    ));


    public receiveExpAction$ = createEffect(() => this.actions$.pipe(
        ofType(explanationsFinishedSuccess),
        switchMap(({sectionId, configIndex}) => [
            logAction({action: {
                type: ActionType.RECEIVE_UNSOLVABLE_EXPLANATION, 
                data: {
                    sectionId: sectionId,
                    configIndex,
                }
            }})
        ])
    ));

    public inspectConfigAction$ = createEffect(() => this.actions$.pipe(
        ofType(inspectConfig),
        switchMap(({sectionId, configIndex}) => [
            logAction({action: {
                type: ActionType.INSPECT_CONFIGURATION, 
                data: {
                    sectionId: sectionId,
                    configIndex,
                }
            }})
        ])
    ));


    public startManualPlanningAction$ = createEffect(() => this.actions$.pipe(
        ofType(registerManualPlanning),
        switchMap(({section, method}) => [
            logAction({action: {
                type: ActionType.START_MANUAL_PLANNING, 
                data: {
                    sectionId: section._id
                }
            }})
        ])
    ));

    public cancelManualPlanningAction$ = createEffect(() => this.actions$.pipe(
        ofType(cancelManualPlanning),
        switchMap(({sectionId, planAttempt, config}) => [
            logAction({action: {
                type: ActionType.INSPECT_CONFIGURATION, 
                data: {
                    sectionId,
                    planAttempt,
                    config,
                }
            }})
        ])
    ));


    public performBelugaActionAction$ = createEffect(() => this.actions$.pipe(
        ofType(createNewBelugaAction),
        switchMap(({action}) => {
            return [
                logAction({action: {
                    type: ActionType.PERFORM_BELUGA_ACTION, 
                    data: {
                        action
                    }
                }})
            ]
        })
    ));


    public undoBelugaActionAction$ = createEffect(() => this.actions$.pipe(
        ofType(undoAction),
        switchMap(({actionToUndo}) => {
            if (actionToUndo.type === createNewBelugaAction.type) {
                return [
                    logAction({action: {
                        type: ActionType.PERFORM_BELUGA_ACTION, 
                        data: {
                            action: (actionToUndo as Action & { action: BelugaAction }).action
                        }
                    }})
                ]
            }
            if (actionToUndo.type === skipIncomingJig.type) {
                return [
                    logAction({action: {
                        type: ActionType.UNDO_UPDATE_CONFIGURATION_MANUAL_PLANNING, 
                        data: {
                            type: 'incoming',
                            ident: (actionToUndo as Action & { jigName: string }).jigName
                        }
                    }})
                ]
            }
            if (actionToUndo.type === skipOutgoingJigType.type) {
                return [
                    logAction({action: {
                        type: ActionType.UNDO_UPDATE_CONFIGURATION_MANUAL_PLANNING, 
                        data: {
                            type: 'outgoing',
                            ident: (actionToUndo as Action & {jigType: string, index: number}).index
                        }
                    }})
                ]
            }
            if (actionToUndo.type === skipProductionJig.type) {
                return [
                    logAction({action: {
                        type: ActionType.UNDO_UPDATE_CONFIGURATION_MANUAL_PLANNING, 
                        data: {
                            type: 'production',
                            ident: (actionToUndo as Action & {jigName: string, productionLine: string}).jigName
                        }
                    }})
                ]
            }

            return [
                logAction({action: {
                    type: ActionType.OTHER, 
                    data: {
                        action: actionToUndo
                    }
                }})
            ]
        })
    ));

    public performSkipIncomingAction$ = createEffect(() => this.actions$.pipe(
        ofType(builderSkipIncomingJig),
        switchMap(({jigName}) => {
            return [
                logAction({action: {
                    type: ActionType.UPDATE_CONFIGURATION_MANUAL_PLANNING, 
                    data: {
                        type: 'incoming',
                        ident: jigName
                    }
                }})
            ]
        })
    ));

    public performSkipOutgoingAction$ = createEffect(() => this.actions$.pipe(
        ofType(builderSkipOutgoingJigType),
        switchMap(({jigType, index}) => {
            return [
                logAction({action: {
                    type: ActionType.UPDATE_CONFIGURATION_MANUAL_PLANNING, 
                    data: {
                        type: 'outgoing',
                        ident: index
                    }
                }})
            ]
        })
    ));


     public performSkipProductionAction$ = createEffect(() => this.actions$.pipe(
        ofType(builderSkipProductionJig),
        switchMap(({jigName, productionLine}) => {
            return [
                logAction({action: {
                    type: ActionType.UPDATE_CONFIGURATION_MANUAL_PLANNING, 
                    data: {
                        type: 'production',
                        ident: jigName
                    }
                }})
            ]
        })
    ));
    
}