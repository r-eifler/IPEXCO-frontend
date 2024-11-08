export enum QuestionType {
  WHY_PLAN = 'WHY_PLAN', // Why is the task unsolvable?
  HOW_PLAN = 'HOW_PLAN', // How can I make the task solvable?
  WHY_NOT_PROPERTY = 'WHY_NOT_PROPERTY',// Why are Q not satisfied?
  WHAT_IF_PROPERTY = 'WHAT_IF_PROPERTY', // What happens if we enforce Q?
  CAN_PROPERTY = 'CAN_PROPERTY', // Can Q be satisfied?
  HOW_PROPERTY = 'HOW_PROPERTY', // How can Q be satisfied?
 
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
