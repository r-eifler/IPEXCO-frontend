import { PDDLPlanningModel } from 'src/app/shared/domain/PDDL_task';
import { GoalType, PlanProperty } from 'src/app/shared/domain/plan-property/plan-property';
import { IterationStep } from '../../domain/iteration_step';
import { PlanPilotPropertyEvaluation, PlanPilotUiFacet } from './planpilot-view.models';

export function evaluatePlanPilotProperties(
  step: IterationStep | undefined,
  properties: Record<string, PlanProperty>,
  solution: PlanPilotUiFacet[],
): PlanPilotPropertyEvaluation[] {
  const selectedIds = step
    ? Array.from(new Set([...(step.hardGoals ?? []), ...(step.softGoals ?? [])]))
    : [];
  if (!step || !selectedIds.length || !solution.length) {
    return [];
  }

  const model = step.task.model as PDDLPlanningModel;
  if (!model || !Array.isArray(model.initial) || !Array.isArray(model.actions)) {
    return selectedIds.flatMap((id) => {
      const property = unsupportedProperty(properties[id], id, step.hardGoals.includes(id));
      return property ? [property] : [];
    });
  }

  const state = new Set(
    model.initial
      .filter((fact) => !('value' in fact) && !fact.negated)
      .map((fact) => factKey(fact.name, fact.arguments)),
  );
  const trace: { timestep: number; state: Set<string>; facetId?: string }[] = [
    { timestep: 0, state: new Set(state) },
  ];
  let traceSupported = true;

  for (const facet of [...solution].sort((left, right) => left.timestep - right.timestep)) {
    const action = model.actions.find((candidate) => candidate.name === facet.action);
    const actionArguments = facet.actionArguments ?? [];
    if (!action || action.parameters.length !== actionArguments.length) {
      traceSupported = false;
      break;
    }
    const bindings = new Map(
      action.parameters.map((parameter, index) => [parameter.name, actionArguments[index]]),
    );
    for (const effect of action.effect) {
      const arguments_ = effect.arguments.map((argument) => bindings.get(argument) ?? argument);
      const key = factKey(effect.name, arguments_);
      if (effect.negated) {
        state.delete(key);
      } else {
        state.add(key);
      }
    }
    trace.push({ timestep: facet.timestep, state: new Set(state), facetId: facet.id });
  }

  return selectedIds.flatMap((id) => {
    const property = properties[id];
    const required = step.hardGoals.includes(id);
    if (
      !property
      || property.type !== GoalType.goalFact
      || !property.definition
      || !traceSupported
    ) {
      const unsupported = unsupportedProperty(property, id, required);
      return unsupported ? [unsupported] : [];
    }

    const key = factKey(property.definition.name, property.definition.parameters);
    const satisfied = trace[trace.length - 1]?.state.has(key) ?? false;
    let stableSinceTimestep: number | null = null;
    let establishedByFacetId: string | undefined;
    if (satisfied) {
      stableSinceTimestep = 0;
      establishedByFacetId = '__session__';
      for (let index = trace.length - 1; index > 0; index -= 1) {
        if (!trace[index - 1].state.has(key)) {
          stableSinceTimestep = trace[index].timestep;
          establishedByFacetId = trace[index].facetId;
          break;
        }
      }
    }

    return [{
      id,
      label: property.name,
      description: property.naturalLanguageDescription,
      color: property.color || '#7e22ce',
      icon: property.icon,
      kind: required ? 'required' as const : 'soft' as const,
      status: satisfied ? 'satisfied' as const : 'unsatisfied' as const,
      stableSinceTimestep,
      establishedByFacetId,
    }];
  });
}

function unsupportedProperty(
  property: PlanProperty | undefined,
  id: string,
  required: boolean,
): PlanPilotPropertyEvaluation | undefined {
  if (!property) {
    return undefined;
  }
  return {
    id,
    label: property.name,
    description: property.naturalLanguageDescription,
    color: property.color || '#64748b',
    icon: property.icon,
    kind: required ? 'required' : 'soft',
    status: 'unsupported',
    stableSinceTimestep: null,
  };
}

function factKey(name: string, arguments_: string[]): string {
  return `${name}(${arguments_.join(',')})`;
}
