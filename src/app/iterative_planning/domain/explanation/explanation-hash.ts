import { ascend, join, pipe, sort } from "ramda";
import { IterationStep } from "../iteration_step";

export function explanationHash(iterationStep: IterationStep): string {
  const goalIds = [...(iterationStep?.hardGoals ?? []), ...(iterationStep?.softGoals ?? [])];
  const idsToHash = pipe(
    sort(ascend<string>(x => x)),
    join('|')
  );

  return idsToHash(goalIds);
}
