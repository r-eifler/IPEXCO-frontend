import { PlanPilotFacet } from '../../service/planpilot.service';
import { FacetSelection, PlanPilotUiFacet } from './planpilot-view.models';

export function mapBackendFacet(
  facet: PlanPilotFacet,
  index: number,
): PlanPilotUiFacet {
  const backendSelection = facet.selectionState as FacetSelection;
  const selection = facet.facetType === 'implied' ? 'neutral' : backendSelection;
  const solutionReduction = metricValue(facet.reduction?.solution, backendSelection) ?? null;
  const facetReduction = metricValue(facet.reduction?.facets, backendSelection) ?? null;
  const remainingSolutions = metricValue(facet.remaining?.solution, backendSelection) ?? null;
  const remainingFacets = metricValue(facet.remaining?.facets, backendSelection) ?? null;
  const visual = visualState(facet.facetType, selection);

  return {
    id: facet.id,
    label: facet.label,
    detail: facetDetail(
      facet,
      solutionReduction,
      facetReduction,
      remainingSolutions,
      remainingFacets,
    ),
    timestep: facet.timestep ?? 0,
    action: facet.action?.name ?? facet.label.split(' ')[0] ?? 'facet',
    actionArguments: facet.action?.arguments ?? [],
    abstractTimeStep: facet.abstractTimeStep,
    group: visual.group,
    selection,
    remainingSolutions,
    remainingFacets,
    solutionReduction,
    facetReduction,
    available: true,
    selectable: facet.selectable ?? facet.facetType !== 'implied',
    nodeType: visual.nodeType,
    parentId: facet.parentId,
    facetType: facet.facetType,
    impliedBy: facet.impliedBy,
    causedBy: facet.causedBy,
    tokens: [
      facet.id,
      facet.label,
      facet.facetType ?? 'facet',
      facet.abstractTimeStep ? 'any-step' : `t${facet.timestep ?? 0}`,
      String(index),
    ],
  };
}

export function withFacetSelectionState(
  facet: PlanPilotUiFacet,
  selection: FacetSelection,
): PlanPilotUiFacet {
  const visual = visualState(facet.facetType, selection);
  return { ...facet, selection, group: visual.group, nodeType: visual.nodeType };
}

export function mapRepresentativeSolution(
  facets: PlanPilotFacet[],
  solutionCount: number,
): PlanPilotUiFacet[] {
  return [...facets]
    .sort((left, right) => (left.timestep ?? 0) - (right.timestep ?? 0))
    .map((facet, index): PlanPilotUiFacet => {
      const timestep = facet.timestep ?? index + 1;
      return {
        id: facet.id,
        label: facet.label,
        detail: `Displayed plan at t${timestep}.`,
        timestep,
        action: facet.action?.name ?? (facet.label.split(' ')[0] || ''),
        actionArguments: facet.action?.arguments ?? [],
        group: 'Displayed plan',
        selection: 'positive',
        remainingSolutions: solutionCount,
        remainingFacets: null,
        solutionReduction: null,
        facetReduction: null,
        available: true,
        selectable: true,
        parentId: facet.parentId,
        facetType: 'plan',
        nodeType: 'plan',
        tokens: [facet.id, facet.label, `t${timestep}`, 'solution'],
        solutionContext: true,
      };
    });
}

function visualState(
  facetType: PlanPilotFacet['facetType'],
  selection: FacetSelection,
): { group: string; nodeType: PlanPilotUiFacet['nodeType'] } {
  if (facetType === 'implied') {
    return { group: 'In every plan', nodeType: undefined };
  }
  if (selection === 'positive') {
    return { group: 'Required by you', nodeType: 'path' };
  }
  if (selection === 'negative') {
    return { group: 'Forbidden by you', nodeType: 'excluded' };
  }
  switch (facetType) {
    case 'selected':
      return { group: 'Required by you', nodeType: 'path' };
    case 'empty':
      return { group: 'Empty timestep', nodeType: undefined };
    default:
      return { group: 'Open candidate', nodeType: 'candidate' };
  }
}

function facetDetail(
  facet: PlanPilotFacet,
  solutionReduction: number | null,
  facetReduction: number | null,
  remainingSolutions: number | null,
  remainingFacets: number | null,
): string {
  const timestep = facet.abstractTimeStep || facet.timestep === null
    ? 'at any step in the plan'
    : `at t${facet.timestep}`;
  const remainingCounts = [
    remainingSolutions === null ? null : `${remainingSolutions} plans`,
    remainingFacets === null ? null : `${remainingFacets} alternatives`,
  ].filter((value): value is string => value !== null);
  const removedCounts = [
    solutionReduction === null ? null : `${solutionReduction} plans`,
    facetReduction === null ? null : `${facetReduction} alternatives`,
  ].filter((value): value is string => value !== null);
  const remaining = remainingCounts.length ? `${remainingCounts.join(' and ')} remain.` : '';
  const removed = removedCounts.length ? `${removedCounts.join(' and ')} removed.` : '';

  return [
    `Occurs ${timestep}.`,
    facet.facetType ? facetTypeText(facet.facetType) : '',
    remaining,
    removed,
  ].filter(Boolean).join(' ');
}

function facetTypeText(facetType: PlanPilotFacet['facetType']): string {
  switch (facetType) {
    case 'plan': return 'No constraint is set for this action.';
    case 'selected': return 'User constraint.';
    case 'implied': return 'PlanPilot finds this action in every remaining plan. It cannot be edited.';
    case 'optional': return 'No constraint is set for this action.';
    case 'empty': return 'This is an unused step in a bounded plan.';
    default: return '';
  }
}

function metricValue(
  pair: { positive: number | null; negative: number | null } | undefined,
  selection: FacetSelection,
): number | undefined {
  if (!pair) {
    return undefined;
  }
  return selection === 'negative'
    ? pair.negative ?? pair.positive ?? undefined
    : pair.positive ?? pair.negative ?? undefined;
}
