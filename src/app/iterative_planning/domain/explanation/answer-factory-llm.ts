import { inject } from "@angular/core";
import { StructuredText } from "../interface/explanation-message";
import { Question } from "../interface/question";
import { IterationStep } from "../iteration_step";
import { QuestionType } from "./explanations";
import { ExplanationTranslationRequest, ExplanationTranslationResponse } from "src/app/LLM/interfaces/translators_interfaces";
import { sendMessageToLLMExplanationTranslator } from "../../state/iterative-planning.actions";
import { Store } from "@ngrx/store";
import { explanationTranslationRequestToString } from "src/app/LLM/interfaces/translators_interfaces_strings";
import { selectIterativePlanningProject, selectIterativePlanningProperties } from "../../state/iterative-planning.selector";
import { selectLLMThreadIdET, selectLLMThreadIdGT } from "../../state/iterative-planning.selector";
import { selectUnsatisfiedSoftGoals } from "../../view/step-detail-view/step-detail-view.component.selector";
import { selectSatisfiedSoftGoals } from "../../view/step-detail-view/step-detail-view.component.selector";
import { selectEnforcedGoals } from "../../view/step-detail-view/step-detail-view.component.selector";
import { combineLatest } from "rxjs";

export function callExplainerTranslatorService(request: ExplanationTranslationRequest) {
  let store = inject(Store);
  let stringRequest: string = explanationTranslationRequestToString(request);
  let threadIdET = store.select(selectLLMThreadIdET);
  threadIdET.subscribe(threadIdET => {
    store.dispatch(sendMessageToLLMExplanationTranslator({ request: stringRequest, threadId: threadIdET }));
  });
}

export function getAnswerLLM(questionType: QuestionType, computed: string[][], propertyDescription?: string) {
  let request = baseExplanationTransatorRequest(questionType, computed, propertyDescription);
}

function whyPlanText() {
  let whyPlanTextRequest = baseExplanationTransatorRequest("question", QuestionType.WHY_PLAN);
  callExplainerTranslatorService(whyPlanTextRequest);
}

function howPlanText() {
  let howPlanTextRequest = baseExplanationTransatorRequest("question", QuestionType.HOW_PLAN);
  callExplainerTranslatorService(howPlanTextRequest);
}

function whyNotPropertyText(computed: string[][], propertyDescription?: string) {
  let whyNotPropertyTextRequest = baseExplanationTransatorRequest("question", QuestionType.WHY_NOT_PROPERTY);
  callExplainerTranslatorService(whyNotPropertyTextRequest);

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

function whatIfPropertyText(computed: string[][], propertyDescription?: string) {
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

function canPropertyText(computed: string[][], propertyDescription?: string) {
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

  function howPropertyText(computed: string[][], propertyDescription?: string) {
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
  return computed
    .filter( MUGS => MUGS.every(id =>
                    ((step.plan !== undefined) &&
                    (step.plan.satisfied_properties !== undefined) &&
                    step.plan.satisfied_properties.includes(id)) ||
                    question.propertyId === id
                )
        )
    .map(MUGS => MUGS.filter(id =>  !(question.propertyId === id)));
}


function howAnswerComputer(step: IterationStep, question: Question, computed: string[][]): string[][] {
    return computed
      .filter( MCGS => MCGS.every(id => !(question.propertyId === id)))
      .map(MUGS => MUGS.filter(id =>  step.plan?.satisfied_properties.includes(id)))
}



