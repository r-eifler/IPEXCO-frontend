import { PDDLAction } from "src/app/interface/planning-task";
import { PPConflict } from "./../../interface/explanations";
import { PlanningTask } from "../../interface/planning-task";
import { PlanRun } from "../../interface/run";
import {
  GoalType,
  PlanProperty,
} from "../../interface/plan-property/plan-property";
import { Plan } from "../../interface/plan";
import { PPDependencies } from "src/app/interface/explanations";

export function parsePlan(planString: string, task: PlanningTask): Plan {
  const lines = planString.split("\n");
  lines.splice(-1, 1); // remove empty line at the end
  const costString = lines.splice(-1, 1)[0];
  const plan = parseActions(lines, task);
  plan.cost = Number(costString.split(" ")[3]);
  return plan;
}

function parseActions(actionStrings: string[], task: PlanningTask): Plan {
  const res: Plan = { actions: [], cost: null };
  for (const a of actionStrings) {
    const action = a.replace("(", "").replace(")", "");
    const [name, ...args] = action.split(" ");
    if (task.model.actions.some((ac) => ac.name === name)) {
      res.actions.push({
        name: name,
        parameters: args.map((a) => {
          return { name: a, type: "" };
        }),
        preconditions: [],
        effects: [],
      });
    }
  }

  return res;
}

export function updateMUGSPropsNames(
  oldMugs: string[][],
  planProperties: Map<string, PlanProperty>
): string[][] {
  const newMUGS = [];
  for (const mugs of oldMugs) {
    const list = [];
    for (const elem of mugs) {
      if (elem.startsWith("Atom")) {
        const fact = elem.replace("Atom ", "").replace(" ", "");
        for (const p of planProperties.values()) {
          if (p.type === GoalType.goalFact && fact === p.formula) {
            list.push(p.name);
            break;
          }
        }
      } else {
        list.push(
          elem
            .replace("sat_", "")
            .replace("soft_accepting(", "")
            .replace(")", "")
        );
      }
    }
    newMUGS.push(list);
  }
  return newMUGS;
}

export function toPPDependencies(
  oldMugs: string[][],
  planProperties: Map<string, PlanProperty>
): PPDependencies {
  const newMUGS = updateMUGSPropsNames(oldMugs, planProperties);
  const ppList = Array.from(planProperties.values());

  let dep: PPDependencies = { conflicts: [] };

  for (const mugs of newMUGS) {
    dep.conflicts.push({
      elems: mugs.map((e) => ppList.find((pp) => pp.name == e)._id),
    });
  }

  return dep;
}
