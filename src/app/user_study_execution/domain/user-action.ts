import { BelugaConfiguration, FlightsHorizon } from "src/app/domain_plugins/beluga/flight-section-planning/domain/flight-section"
import { BelugaAction } from "src/app/domain_plugins/beluga/shared/domain/beluga_plan"
import { BelugaSiteSetUp } from "src/app/domain_plugins/beluga/shared/domain/site_set_up"
import { QuestionType } from "src/app/iterative_planning/domain/explanation/explanations"
import { PlanRunStatus } from "src/app/iterative_planning/domain/plan"

export enum ActionType {
    OTHER = 'OTHER',
    START_STUDY = 'START_STUDY',
    END_STUDY = 'END_STUDY',
    START_EXTERNAL = 'START_EXTERNAL',
    OPEN_EXTERNAL_LINK = 'OPEN_EXTERNAL_LINK',
    END_EXTERNAL = 'END_EXTERNAL',
    START_DESCRIPTION = 'START_DESCRIPTION',
    END_DESCRIPTION = 'END_DESCRIPTION',
    START_DEMO = 'START_DEMO',
    END_DEMO = 'END_DEMO',
    START_DEMO_INFO = 'START_DEMO_INFO',
    END_DEMO_INFO = 'END_DEMO_INFO',
    START_USER_MANUAL = 'START_USER_MANUAL',
    END_USER_MANUAL = 'END_USER_MANUAL',
    CREATE_ITERATION_STEP = 'CREATE_ITERATION_STEP',
    PLAN_FOR_ITERATION_STEP = 'PLAN_FOR_ITERATION_STEP',
    CANCEL_PLAN_FOR_ITERATION_STEP = 'PLAN_FOR_ITERATION_STEP',
    INSPECT_ITERATION_STEP = 'INSPECT_ITERATION_STEP',
    ASK_QUESTION = 'ASK_QUESTION',
    EXPLANATION = 'EXPLANATION',
    FAILED = 'FAILED',
    ASK_QT = 'ASK_QT',
    ANSWER_QT = 'ANSWER_QT',
    FAILED_QT = 'FAILED_QT',
    ASK_ET = 'ASK_ET',
    ANSWER_ET = 'ANSWER_ET',
    FAILED_ET = 'FAILED_ET',
    ASK_GT = 'ASK_GT',
    ANSWER_GT = 'ANSWER_GT',
    FAILED_GT = 'FAILED_GT',
    LLM_CONTEXT = 'LLM_CONTEXT',
    ASK_QUESTION_LLM = 'ASK_QUESTION_LLM',
    DIRECT_RESPONSE_QT = 'DIRECT_RESPONSE_QT',
    DIRECT_QUESTION_ET = 'DIRECT_QUESTION_ET',

    // Beluga
    START_TASK = 'START_TASK',
    END_TASK = 'END_TASK',
    //Both
    NEXT_FLIGHT_SECTION = 'NEXT_FLIGHT_SECTION',
    START_INSPECT_PLAN = 'START_INSPECT_PLAN',
    STOP_INSPECT_PLAN = 'STOP_INSPECT_PLAN',
    //Automatic
    CALL_PLANNER = 'CALL_PLANNER',
    GET_PLANNER_RESULT = 'GET_PLANNER_RESULT',
    START_NEW_CONFIGURATION = 'START_NEW_CONFIGURATION',
    UPDATE_CONFIGURATION = 'START_NEW_CONFIGURATION',
    FINISH_NEW_CONFIGURATION = 'FINISH_NEW_CONFIGURATION',
    CANCEL_NEW_CONFIGURATION = 'CANCEL_NEW_CONFIGURATION',
    REQUEST_UNSOLVABLE_EXPLANATION = 'REQUEST_UNSOLVABLE_EXPLANATION',
    RECEIVE_UNSOLVABLE_EXPLANATION = 'RECEIVE_UNSOLVABLE_EXPLANATION',
    INSPECT_CONFIGURATION = 'INSPECT_CONFIGURATION',

    //Manual
    START_MANUAL_PLANNING = 'START_MANUAL_PLANNING',
    FINISH_MANUAL_PLANNING = 'FINISH_MANUAL_PLANNING',
    CANCEL_MANUAL_PLANNING = 'CANCEL_MANUAL_PLANNING',
    PERFORM_BELUGA_ACTION = 'PERFORM_BELUGA_ACTION',
    UNDO_BELUGA_ACTION = 'UNDO_BELUGA_ACTION',
    UPDATE_CONFIGURATION_MANUAL_PLANNING = 'UPDATE_CONFIGURATION_MANUAL_PLANNING',
    UNDO_UPDATE_CONFIGURATION_MANUAL_PLANNING = 'UNDO_UPDATE_CONFIGURATION_MANUAL_PLANNING',
}


export interface UserAction {
    type: ActionType
    timeStamp?: Date,
    data?: unknown
}

export interface OtherUserAction extends UserAction {
    type: ActionType.OTHER,
}

export interface StartStudyUserAction extends UserAction {
    type: ActionType.START_STUDY,
} 

export interface EndStudyUserAction extends UserAction {
    type: ActionType.END_STUDY,
} 


export interface StartDescriptionUserAction extends UserAction {
    type: ActionType.START_DESCRIPTION,
    data: {
        stepIndex: number,
        stepName: string,
    }
} 

export interface EndDescriptionUserAction extends UserAction {
    type: ActionType.END_DESCRIPTION,
    data: {
        stepIndex: number,
        stepName: string,
    }
} 


export interface StartExternalUserAction extends UserAction {
    type: ActionType.START_EXTERNAL,
    data: {
        stepIndex: number,
        stepName: string,
    }
} 

export interface OpenExternalLinkUserAction extends UserAction {
    type: ActionType.OPEN_EXTERNAL_LINK,
    data: {
        stepIndex: number,
        stepName: string,
    }
} 

export interface EndExternalUserAction extends UserAction {
    type: ActionType.END_EXTERNAL,
    data: {
        stepIndex: number,
        stepName: string,
    }
} 


export interface StartDemoUserAction extends UserAction {
    type: ActionType.START_DEMO,
    data: {
        stepIndex: number,
        demoId: string,
        stepName: string,
    }
} 

export interface EndDemoUserAction extends UserAction {
    type: ActionType.END_DEMO,
    data: {
        stepIndex: number,
        demoId: string,
        stepName: string,
    }
} 


export interface CreateIterationStepUserAction extends UserAction {
    type: ActionType.CREATE_ITERATION_STEP
    data: {
        stepId: string,
        demoId: string
    }
}

export interface PlanForIterationStepUserAction extends UserAction {
    type: ActionType.PLAN_FOR_ITERATION_STEP
    data: {
        demoId: string,
        stepId: string,
        planStatus: PlanRunStatus, 
        utility: number | null,
    }
}

export interface CancelPlanForIterationStepUserAction extends UserAction {
    type: ActionType.CANCEL_PLAN_FOR_ITERATION_STEP
    data: {
        demoId: string,
        stepId: string,
    }
}

export interface InspectIterationStepUserAction extends UserAction {
    type: ActionType.INSPECT_ITERATION_STEP
    data: {
        demoId: string,
        stepId: string,
    }
}

export interface AskQuestionUserAction extends UserAction {
    type: ActionType.ASK_QUESTION
    data: {
        demoId: string,
        stepId: string,
        propertyId?: string;
        questionType: QuestionType;
    }
} 

export interface ExplanationUserAction extends UserAction {
    type: ActionType.EXPLANATION
    data: {
        demoId: string,
        iterationStepId: string;
        message: string;
        propertyId?: string;
        questionType: QuestionType;
        subSets?: string[][];
    }
} 


// Beluga

export interface StartTaskUserAction extends UserAction {
    type: ActionType.START_TASK
    data: {
         stepIndex: number,
        stepName: string,
        projectId: string
    }
}

export interface EndTaskUserAction extends UserAction {
    type: ActionType.END_TASK
    data: {
        stepIndex: number,
        stepName: string,
        projectId: string
    }
}



export interface NextFlightSectionUserAction extends UserAction {
    type: ActionType.NEXT_FLIGHT_SECTION
    data: {
        section: FlightsHorizon;
    }
}

export interface StartInspectPlanUserAction extends UserAction {
    type: ActionType.START_INSPECT_PLAN,
    data: {
        sectionId: string;
    }
}

export interface StopInspectPlanUserAction extends UserAction {
    type: ActionType.STOP_INSPECT_PLAN,
    data: {
        sectionId: string;
    }
}


export interface CallPlannerUserAction extends UserAction {
    type: ActionType.CALL_PLANNER,
    data: {
        sectionId: string;
    }
}


export interface GetPlannerResultUserAction extends UserAction {
    type: ActionType.GET_PLANNER_RESULT,
    data: {
        sectionId: string;
    }
}


export interface StartNewConfigurationUserAction extends UserAction {
    type: ActionType.START_NEW_CONFIGURATION,
    data: {
        sectionId: string | undefined;
        baseConfigIndex: number;
    }
}

export interface UpdateNewConfigurationUserAction extends UserAction {
    type: ActionType.UPDATE_CONFIGURATION,
    data: {
        sectionId: string;
        baseConfigIndex: number;
        update: {
            type: 'rack' | 'trailer'| 'hangar'| 'incoming' | 'outgoing' | 'production' | 'swaps' | 'rack_empty',
            name: string | undefined,
            index: number | undefined,
            value: any,
        }
    }
}

export interface FinishNewConfigurationUserAction extends UserAction {
    type: ActionType.FINISH_NEW_CONFIGURATION,
    data: {
        sectionId: string;
        baseConfigIndex: number;
        newConfigIndex: number;
        newConfig: BelugaConfiguration;
    }
}

export interface CancelNewConfigurationUserAction extends UserAction {
    type: ActionType.CANCEL_NEW_CONFIGURATION,
    data: {
        sectionId: string;
        baseConfigIndex: number;
    }
}

export interface RequestUnsolvableExplanationUserAction extends UserAction {
    type: ActionType.REQUEST_UNSOLVABLE_EXPLANATION,
    data: {
        sectionId: string;
        configIndex: number;
    }
}

export interface ReceiveUnsolvableExplanationUserAction extends UserAction {
    type: ActionType.RECEIVE_UNSOLVABLE_EXPLANATION,
    data: {
        sectionInd: string;
        configIndex: number;
    }
}

export interface InspectConfigurationUserAction extends UserAction {
    type: ActionType.INSPECT_CONFIGURATION,
    data: {
        sectionId: string;
        configIndex: number;
    }
}

export interface StartManualPlanningUserAction extends UserAction {
    type: ActionType.START_MANUAL_PLANNING,
    data: {
        sectionId: string;
    }
}

export interface FinishManualPlanningUserAction extends UserAction {
    type: ActionType.FINISH_MANUAL_PLANNING,
    data: {
        sectionId: string;
    }
}

export interface CancelManualPlanningUserAction extends UserAction {
    type: ActionType.CANCEL_MANUAL_PLANNING,
    data: {
        sectionId: string;
        planAttempt: BelugaAction[],
        config: BelugaConfiguration,
    }
}

export interface PerformBelugaActionUserAction extends UserAction {
    type: ActionType.PERFORM_BELUGA_ACTION,
    data: {
        action: BelugaAction;
    }
}

export interface UndoBelugaActionUserAction extends UserAction {
    type: ActionType.UNDO_BELUGA_ACTION,
    data: {
        action: BelugaAction;
    }
}

export interface UpdateConfigurationManualPlanningUserAction extends UserAction {
    type: ActionType.UPDATE_CONFIGURATION_MANUAL_PLANNING,
    data: {
        sectionId: string;
        baseConfigIndex: number;
        updatingConfig: BelugaConfiguration;
        update: {
            type: 'incoming' | 'outgoing' | 'production',
            ident: any,
        }
    }
}

export interface UndoUpdateConfigurationManualPlanningUserAction extends UserAction {
    type: ActionType.UNDO_UPDATE_CONFIGURATION_MANUAL_PLANNING,
    data: {
        sectionId: string;
        baseConfigIndex: number;
        updatingConfig: BelugaConfiguration;
        update: {
            type: 'incoming' | 'outgoing' | 'production',
            ident: any,
        }
    }
}