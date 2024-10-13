
export enum QuestionType {
  WHY = 'WHY',
  HOW = 'HOW',
  WHY_NOT = 'WHY_NOT',
  WHAT_IF = 'WHAT_IF',
  CAN = 'CAN'
}

export interface Question{
  input: string;
  type: QuestionType,
  forSolvableInstance: boolean,
  parameters: string[];
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

export interface Explanation{
  createdAt?: Date;
  question: Question;
  answer?: Answer;
  status: ExplanationRunStatus;
}

export interface GlobalExplanation{
  createdAt?: Date;
  MUGS?: string[][];
  MGCS?: string[][];
  status: ExplanationRunStatus;
}
