import { array, coerce, nativeEnum, object, optional, string, infer as zinfer } from "zod";

export enum QuestionType {
  WHY_PLAN = 'US-WHY', // Why is the task unsolvable?
  HOW_PLAN = 'US-HOW', // How can I make the task solvable?
  WHY_NOT_PROPERTY = 'S-WHY-NOT',// Why are Q not satisfied?
  WHAT_IF_PROPERTY = 'S-WHAT-IF', // What happens if we enforce Q?
  CAN_PROPERTY = 'S-CAN', // Can Q be satisfied?
  HOW_PROPERTY = 'S-HOW', // How can Q be satisfied?
  DIRECT_USER = 'DIRECT-USER',
  DIRECT_ET = 'DIRECT-ET',
 
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
  PENDING = "PENDING",
  RUNNING = "RUNNING",
  FAILED = "FAILED",
  FINISHED = "FINISHED"
}

export const ExplanationRunStatusZ = nativeEnum(ExplanationRunStatus);

export const GlobalExplanationZ = object({
  createdAt: coerce.date(),
  MUGS: optional(array(array(string()))),
  MGCS: optional(array(array(string()))),
  status: ExplanationRunStatusZ
});

export type GlobalExplanation = zinfer<typeof GlobalExplanationZ>;

export const DefinedGlobalExplanationZ = object({
  createdAt: coerce.date(),
  MUGS: array(array(string())),
  MGCS: array(array(string())),
  status: ExplanationRunStatusZ
});

export type DefinedGlobalExplanation = zinfer<typeof DefinedGlobalExplanationZ>;