import { StructuredText } from "../interface/explanation-message";
import { Question } from "../interface/question";
import { IterationStep } from "../iteration_step";
import { GlobalExplanation, QuestionType } from "./explanations";


export function getComputedBase(questionType: QuestionType, explanation: GlobalExplanation): string[][] {
  console.log("Explanation: ", explanation.MGCS, explanation.MUGS, explanation.status);
  switch(questionType) {
    case QuestionType.WHY_PLAN:
      return explanation?.MUGS;
    case QuestionType.HOW_PLAN:
      return explanation?.MGCS;
    case QuestionType.WHY_NOT_PROPERTY:
      return explanation?.MUGS;
    case QuestionType.WHAT_IF_PROPERTY:
      return explanation?.MUGS;
    case QuestionType.CAN_PROPERTY:
      return explanation?.MUGS;
    case QuestionType.HOW_PROPERTY:
      return explanation?.MGCS;
  }
}

export function mapComputeBase(step: IterationStep, question: Question, computed: string[][]): string[][] {
  switch(question.questionType) {
    case QuestionType.WHY_PLAN:
      return filterWhyPlan(step, computed);
    case QuestionType.HOW_PLAN:
      return filterHowPlan(step, computed);
    case QuestionType.WHY_NOT_PROPERTY:
      return whyAnswerComputer(step, question, computed);
    case QuestionType.WHAT_IF_PROPERTY:
      return whyAnswerComputer(step, question, computed);
    case QuestionType.CAN_PROPERTY:
      return whyAnswerComputer(step, question, computed);
    case QuestionType.HOW_PROPERTY:
      return howAnswerComputer(step, question, computed);
  }
}

export function getAnswer(questionType: QuestionType, computed: string[][], propertyDescription?: string): StructuredText {
  switch(questionType) {
    case QuestionType.WHY_PLAN:
      return whyPlanText();
    case QuestionType.HOW_PLAN:
      return howPlanText();
    case QuestionType.WHY_NOT_PROPERTY:
      return whyNotPropertyText(computed, propertyDescription);
    case QuestionType.WHAT_IF_PROPERTY:
      return whatIfPropertyText(computed, propertyDescription);
    case QuestionType.CAN_PROPERTY:
      return canPropertyText(computed, propertyDescription);
    case QuestionType.HOW_PROPERTY:
      return howPropertyText(computed, propertyDescription);
  }
}

function whyPlanText(): StructuredText {
  return {
    includeComputation: true,
    mainText: 'The selection of enforced goals is unsolvable, because of the following conflicts:',
    setPrefix: 'The properties',
    setConnector: 'and',
    setSuffix: 'are conflicting.',
  };
}

function howPlanText(): StructuredText {
  return {
    includeComputation: true,
    mainText: 'In order to make the plan solvable, you have to forego one of the following combination of properties.',
    topLevelPrefix: 'Give up on either',
    topLevelConnector: 'or',
    setConnector: 'and',
  };
}

function whyNotPropertyText(computed: string[][], propertyDescription?: string): StructuredText {
  let mainText: string;
  let includeComputation = true;

  if (computed?.length === 0) {
    mainText = `The goal "${propertyDescription}" can be satisfied without impacting any of the already satisfied goals.`;
  } else if (computed?.some(s => s?.length === 0)) {
    mainText = `This goal "${propertyDescription}" itself cannot be satisfied.`;
    includeComputation = false;
  } else {
    mainText = `This goal "${propertyDescription}" cannot be satisifed, since it is in conflict with each of the following set of goals:`;
  }

  return {
    includeComputation,
    mainText,
    setPrefix: `"${propertyDescription}" is in conflict with`,
    setConnector: 'and'
  };
}

function whatIfPropertyText(computed: string[][], propertyDescription?: string): StructuredText {
  let mainText: string;
  let includeComputation = true;

  if (computed?.length === 0) {
    mainText = `The goal "${propertyDescription}" can be satisfied without impacting any of the already satisfied goals.`;
    includeComputation = false;
  } else if (computed?.some(s => s?.length == 0)) {
    mainText = `Enforcing "${propertyDescription}" would lead to an unsolvable plan.`;
    includeComputation = false;
  } else {
    mainText = `Enforcing "${propertyDescription}" would imply, that any of the following goal sets would no longer be satisfied.`;
  }

  return {
    includeComputation,
    mainText,
    setPrefix: 'The properties',
    setSuffix: 'could not longer be satisfied.',
    setConnector: 'and',
  };
}

function canPropertyText(computed: string[][], propertyDescription?: string): StructuredText {
  let mainText: string;

  if (computed?.length === 0 ) {
    mainText = `Yes, the goal "${propertyDescription}" can be enforced.`;
  } else {
    mainText = `The goal "${propertyDescription}" cannot be enforced.`;
  }

  return {
    includeComputation: false,
    mainText,
  };
}

function howPropertyText(computed: string[][], propertyDescription?: string): StructuredText {
  let mainText: string;
  let includeComputation = true;

  if (computed?.some(s => s?.length === 0)) {
    mainText = `The goal "${propertyDescription}" can be satisfied without impacting any of the already existing goals.`;
    includeComputation = false;
  } else if (computed?.length === 0) {
    mainText = `It is not possible to satisfy the goal "${propertyDescription}".`;
    includeComputation = false;
  } else {
    mainText = `Satisfying "${propertyDescription}" would entail, that you have to forgo one of the following goal sets:`;
  }

  return {
    includeComputation,
    mainText,
    setConnector: 'and',
  }
}

function filterWhyPlan(iterationStep: IterationStep, computed: string[][]): string[][] {
  return computed.filter(
    MUGS => MUGS.every(id => iterationStep.hardGoals.includes(id))
  );
}

function filterHowPlan(iterationStep: IterationStep, computed: string[][]): string[][] {
  return computed.filter(
    MUGS => MUGS.every(id => iterationStep.hardGoals.includes(id))
  );
}

function whyAnswerComputer(step: IterationStep, question: Question, computed: string[][]): string[][] {
  console.log("Computed: " + computed);
  return subsetMinimal(computed
    .filter( MUGS => MUGS.every(id =>
                    ((step.plan !== undefined) &&
                    (step.plan.satisfied_properties !== undefined) &&
                    step.plan.satisfied_properties.includes(id)) ||
                    question.propertyId === id
                )
        )
    .map(MUGS => MUGS.filter(id =>  !(question.propertyId === id))));
}


function howAnswerComputer(step: IterationStep, question: Question, computed: string[][]): string[][] {
    return subsetMinimal(computed
      .filter( MCGS => MCGS.every(id => !(question.propertyId === id)))
      .map(MCGS => MCGS.filter(id =>  step.plan?.satisfied_properties.includes(id))))
}


function subsetMinimal(original: string[][]): string[][]{
  let result: string[][] = [];
  for(let list of original){
    if(result.some(rl => rl.every(re => list.includes(re)))){
      continue;
    }
    result = result.filter(rl => !rl.every(re => list.includes(re)));
    result.push(list);
  }
  return result;
}