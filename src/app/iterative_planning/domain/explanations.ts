import { PDDLFact } from "src/app/interface/planning-task";
import { PlanProperty } from "./plan-property/plan-property";


export enum QuestionType {
  // TODO
  why_not,
  how
}

export interface Question{
  input: string;
  type: QuestionType
  parameters: PlanProperty[];
}

export enum AnswerType {
  MUS,
  MCS
}

export interface Answer{
  type: AnswerType
  all_possibilities: boolean;
  computed: PlanProperty[];
  selected: PlanProperty[];
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
