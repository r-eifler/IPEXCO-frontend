import { map } from 'rxjs/operators';
import { PlanningTask, Action } from './../../interface/plannig-task';
import {PlanRun} from '../../interface/run';
import {GoalType, PlanProperty} from '../../interface/plan-property/plan-property';
import {TaskSchema} from '../../interface/task-schema';
import {Plan} from '../../interface/plan';
import {Demo} from '../../interface/demo';

export function computePlanValue(planRun: PlanRun, planProperties: Map<string, PlanProperty>): number {
  if (! planRun.planString && ! planRun.planPath) {
    return 0;
  }
  let planValue = 0;
  for (const propName of planRun.hardGoals) {
    const prop = planProperties.get(propName);
    if (! prop) {
      return null;
    }
    planValue += prop.value;
  }
  for (const propName of planRun.satPlanProperties) {
    if (! planRun.hardGoals.find(p => p === propName)) {
      planValue += planProperties.get(propName).value;
    }
  }
  return planValue;
}

export function handlePlanString(planString: string, planRun: PlanRun, task: PlanningTask) {
  const lines = planString.split('\n');
  lines.splice(-1, 1); // remove empty line at the end
  const costString = lines.splice(-1, 1)[0];
  const plan = parsePlan(lines, task);
  plan.cost = Number(costString.split(' ')[3]);
  planRun.plan = plan;
}

function parsePlan(actionStrings: string[], task: PlanningTask): Plan {
  const res: Plan = {actions: [], cost: null};
  for (const a of actionStrings) {
    const action = a.replace('(', '').replace(')', '');
    const [name, ...args] = action.split(' ');
    if (task.actions.some(ac => ac.name === name)) {
      res.actions.push(new Action(name, args.map(a => {return {name: a, type: ''}}), [], []));
    }
  }

  return res;
}

export function updateMUGSPropsNames(oldMugs: string[][], planProperties: Map<string, PlanProperty>): string[][] {
  const newMUGS = [];
  for (const mugs of oldMugs) {
    const list = [];
    for (const elem of mugs) {
      if (elem.startsWith('Atom')) {
        const fact = elem.replace('Atom ', '').replace(' ', '');
        for (const p of planProperties.values()) {
          if (p.type === GoalType.goalFact && fact === p.formula) {
            list.push(p.name);
            break;
          }
        }
      } else {
        list.push(elem.replace('sat_', '').replace('soft_accepting(', '').replace(')', ''));
      }
    }
    newMUGS.push(list);
  }
  return newMUGS;
}
