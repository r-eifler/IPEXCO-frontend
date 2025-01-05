import { QuestionType } from "src/app/iterative_planning/domain/explanation/explanations"

export enum ActionType {
    OTHER = 'OTHER',
    START_STUDY = 'START_STUDY',
    END_STUDY = 'END_STUDY',
    START_EXTERNAL = 'START_EXTERNAL',
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
}


export interface UserAction {
    type: ActionType
    timeStamp?: Date,
    data?: any
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
        utility,
    }
}

export interface CancelPlanForIterationStepUserAction extends UserAction {
    type: ActionType.PLAN_FOR_ITERATION_STEP
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
