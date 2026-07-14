import { array, boolean, coerce, infer as zinfer, nativeEnum, number, object, string } from "zod";

export enum PlanPilotSelectionState {
  NEUTRAL = 'neutral',
  POSITIVE = 'positive',
  NEGATIVE = 'negative',
}

export const PlanPilotSelectionStateZ = nativeEnum(PlanPilotSelectionState);

export type PlanPilotFacet = zinfer<typeof PlanPilotFacetZ>;

export const PlanPilotFacetMetricPairZ = object({
  positive: number().nullable(),
  negative: number().nullable(),
});

export const PlanPilotFacetMetricsZ = object({
  solution: PlanPilotFacetMetricPairZ,
  facets: PlanPilotFacetMetricPairZ,
});


export const PlanPilotFacetZ = object({
  id: string(),
  label: string(),
  timestep: number().int().nullable(),
  selectionState: PlanPilotSelectionStateZ,
  reduction: PlanPilotFacetMetricsZ.optional(),
  remaining: PlanPilotFacetMetricsZ.optional(),
});

export const PlanPilotSolutionZ = object({
  label: string(),
  facets: array(PlanPilotFacetZ),
});

export type PlanPilotSolution = zinfer<typeof PlanPilotSolutionZ>;

export enum PlanPilotEncoding {
  EXACT = 'exact',
  BOUNDED = 'bounded',
}

export const PlanPilotEncodingZ = nativeEnum(PlanPilotEncoding);

export const PlanPilotSessionConfigurationZ = object({
  horizon: number().int().positive(),
  encoding: PlanPilotEncodingZ,
  abstractTimeSteps: boolean(),
});

export type PlanPilotSessionConfiguration = zinfer<typeof PlanPilotSessionConfigurationZ>;

export enum PlanPilotRunStatus {
  CREATED = "CREATED",
  STARTING = "STARTING",
  READY = "READY",
  FAILED = "FAILED",
  EXPIRED = "EXPIRED",
  STOPPED = "STOPPED",
}

export const PlanPilotRunStatusZ = nativeEnum(PlanPilotRunStatus);

export const PlanPilotFacetsResponseZ = object({
  runId: string(),
  facets: array(PlanPilotFacetZ),
});

export type PlanPilotFacetsResponse = zinfer<typeof PlanPilotFacetsResponseZ>;

export const StartPlanPilotSessionResponseZ = object({
  runId: string(),
  externalSessionId: string(),
  status: PlanPilotRunStatusZ,
  configuration: PlanPilotSessionConfigurationZ,
  expiresAt: coerce.date().optional(),
  facets: array(PlanPilotFacetZ),
});

export type StartPlanPilotSessionResponse = zinfer<typeof StartPlanPilotSessionResponseZ>;

export enum PlanPilotQueryType {
  FACETS = 'facets',
  FACET_COUNT = 'facetCount',
  FACET_REDUCTION = 'facetReduction',
  SOLUTION = 'solution',
  SOLUTION_COUNT = 'solutionCount',
  SOLUTION_REDUCTION = 'solutionReduction',
}

export const PlanPilotQueryTypeZ = nativeEnum(PlanPilotQueryType);

export const PlanPilotQueryResultZ = object({
  type: PlanPilotQueryTypeZ,
  value: number().optional(),
  facets: array(PlanPilotFacetZ).optional(),
  solutions: array(PlanPilotSolutionZ).optional(),
});

export type PlanPilotQueryResult = zinfer<typeof PlanPilotQueryResultZ>;

export const QueryPlanPilotSessionResponseZ = object({
  runId: string(),
  result: PlanPilotQueryResultZ,
});

export type QueryPlanPilotSessionResponse = zinfer<typeof QueryPlanPilotSessionResponseZ>;

export interface QueryPlanPilotSessionRequest {
  type: PlanPilotQueryType;
  solutionNumber?: number;
}

export interface StartPlanPilotSessionRequest {
  iterationStepId: string;
  horizon: number;
  encoding: PlanPilotEncoding;
  abstractTimeSteps: boolean;
}

export interface SelectPlanPilotFacetRequest {
  facetId: string;
  selectionState: PlanPilotSelectionState;
  previousSelectionState?: PlanPilotSelectionState;
}
