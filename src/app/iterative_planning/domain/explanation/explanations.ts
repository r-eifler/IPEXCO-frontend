
export enum QuestionType {
  WHY_PLAN = 'WHY_PLAN',
  HOW_PLAN = 'HOW_PLAN',
  WHY_NOT_PROPERTY = 'WHY_NOT_PROPERTY',
  WHAT_IF_PROPERTY = 'WHAT_IF_PROPERTY',
  CAN_PROPERTY = 'CAN_PROPERTY',
  HOW_PROPERTY = 'HOW_PROPERTY',
}

export enum AnswerType {
  MUGS = 'MUGS',
  MGCS = 'MGCS',
 }

export interface Answer{
  type: AnswerType
  complete: boolean; // all possible answers have been computed
  computed: string[][];
  selected: string[][];
  output: string;
}

export enum ExplanationRunStatus {
  pending,
  running,
  failed,
  finished
}

export interface GlobalExplanation{
  createdAt?: Date;
  MUGS?: string[][];
  MGCS?: string[][];
  status: ExplanationRunStatus;
}
