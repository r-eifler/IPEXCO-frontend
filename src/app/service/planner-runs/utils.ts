import { PDDLAction } from "src/app/interface/planning-task";
import { PlanningTask } from "../../interface/planning-task";
import {
  GoalType,
  PlanProperty,
} from "../../iterative_planning/domain/plan-property/plan-property";
import { Plan, PlanRunStatus } from "src/app/iterative_planning/domain/plan";


export function parsePlan(planString: string, task: PlanningTask): Plan {
  const lines = planString.split("\n");
  lines.splice(-1, 1); // remove empty line at the end
  const costString = lines.splice(-1, 1)[0];
  const plan = parseActions(lines, task);
  plan.cost = Number(costString.split(" ")[3]);
  return plan;
}

function parseActions(actionStrings: string[], task: PlanningTask): Plan {
  const res: Plan = { actions: [], cost: null, status: PlanRunStatus.plan_found };
  for (const a of actionStrings) {
    const action = a.replace("(", "").replace(")", "");
    const [name, ...args] = action.split(" ");
    if (task.model.actions.some((ac) => ac.name === name)) {
      res.actions.push({
        name: name,
        arguments: args.map((a) => {
          return a;
        }),
      });
    }
  }

  return res;
}

export function updateMUGSPropsNames(
  oldMugs: string[][],
  planProperties: Record<string, PlanProperty>
): string[][] {
  const newMUGS = [];
  for (const mugs of oldMugs) {
    const list = [];
    for (const elem of mugs) {
      if (elem.startsWith("Atom")) {
        const fact = elem.replace("Atom ", "").replace(" ", "");
        for (const p of Object.values(planProperties)) {
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

// export function toPPDependencies(
//   oldMugs: string[][],
//   planProperties: Record<string, PlanProperty>
// ): PPDependencies {
//   const newMUGS = updateMUGSPropsNames(oldMugs, planProperties);
//   const ppList = Array.from(planProperties.values());

//   let dep: PPDependencies = { conflicts: [] };

//   for (const mugs of newMUGS) {
//     dep.conflicts.push({
//       elems: mugs.map((e) => ppList.find((pp) => pp.name == e)._id),
//     });
//   }

//   return dep;
// }
