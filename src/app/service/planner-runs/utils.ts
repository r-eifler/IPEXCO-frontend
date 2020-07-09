import {PlanRun} from '../../interface/run';
import {PlanProperty} from '../../interface/plan-property/plan-property';
import {TaskSchema} from '../../interface/task-schema';
import {Plan} from '../../interface/plan';

export function computePlanValue(planRun: PlanRun, planProperties: Map<string, PlanProperty>): number {
  let planValue = 0;
  for (const propName of planRun.hardGoals) {
    planValue += planProperties.get(propName).value;
  }
  for (const propName of planRun.satPlanProperties) {
    if (! planRun.hardGoals.find(p => p === propName)) {
      planValue += planProperties.get(propName).value;
    }
  }
  return planValue;
}

export function handlePlanString(planString: string, planRun: PlanRun, schema: TaskSchema) {
  const lines = planString.split('\n');
  lines.splice(-1, 1); // remove empty line at the end
  const costString = lines.splice(-1, 1)[0];
  const plan = parsePlan(lines, schema);
  plan.cost = Number(costString.split(' ')[3]);
  planRun.plan = plan;
}

function parsePlan(actionStrings: string[], schema: TaskSchema): Plan {
  const res: Plan = {actions: [], cost: null};
  for (const a of actionStrings) {
    const action = a.replace('(', '').replace(')', '');
    const [name, ...args] = action.split(' ');
    if (schema.actions.some(ac => ac.name === name)) {
      res.actions.push({name, args});
    }
  }

  return res;
}
