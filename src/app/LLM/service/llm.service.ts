import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { map, tap } from "rxjs/operators";
import { IHTTPData } from "src/app/interface/http-data.interface";
import { Message } from "../domain/message";
import { ExplanationTranslationRequest, GoalTranslationRequest, QuestionTranslationRequest, GoalTranslationResponse, QuestionTranslationResponse,ExplanationTranslationResponse, QuestionTranslatorHistory, ExplanationTranslatorHistory } from "../translators_interfaces";
import * as templates from "../templates.json"
import { ofType } from "@ngrx/effects";
import { isTypeElement } from "typescript";

@Injectable()
export class LLMService{

    private http = inject(HttpClient)
    private BASE_URL = environment.apiURL + "llm/";

    
    postMessage$(messages: Message[] | TranslationHistory, endpoint: string): Observable<string> {
        endpoint = endpoint ?? 'simple';

        if(endpoint === 'gt'){
            messages = prepareGoalTranslatorMessage(messages as GoalTranslationHistory);
        }
        else if(endpoint === 'qt'){
            messages = prepareQuestionTranslatorMessage(messages as QuestionTranslationRequest);
        }
        else if(endpoint === 'et'){
            messages = prepareExplanationTranslatorMessage(messages as ExplanationTranslationRequest);
        }
        console.log(messages);
        return this.http.post<IHTTPData<string>>(this.BASE_URL + endpoint, { data: messages }).pipe(
            map(({ data }) => data),
            tap(console.log)
        );
    }
}

function prepareGoalTranslatorMessage(input: GoalTranslationRequest): string {
    const promptTemplate = templates.goal_translator;
  
    // Replace placeholders with actual values
    return promptTemplate
      .replace('{goal}', input.goalDescription)
      .replace('{predicates}', JSON.stringify(input.predicates))
      .replace('{objects}', JSON.stringify(input.objects))
      .replace('{existing_plan_properties}', JSON.stringify(input.existingPlanProperties));
}
  
function prepareGoalTranslatorResponse(response: GoalTranslatorResponse): string {
    const formula = 

}
  
  function prepareQuestionTranslatorMessage(input: QuestionTranslationRequest): string {
    const promptTemplate = templates.question_translator;
    return promptTemplate
      .replace('{question}', input.question)
      .replace('{enforced_goals}', JSON.stringify(input.enforcedGoals))
      .replace('{satisfied_goals}', JSON.stringify(input.satisfiedGoals))
      .replace('{unsatisfied_goals}', JSON.stringify(input.unsatisfiedGoals))
      .replace('{existing_plan_properties}', JSON.stringify(input.existingPlanProperties));
  }
  
  function prepareExplanationTranslatorMessage(input: ExplanationTranslationRequest): string {
    const promptTemplate = templates.explanation_translator;
  
    return promptTemplate
      .replace('{question}', input.question)
      .replace('{question_type}', input.question_type)
      .replace('{question_arguments}', JSON.stringify(input.questionArguments))
      .replace('{MUGS}', JSON.stringify(input.MUGS))
      .replace('{MGCS}', JSON.stringify(input.MGCS))
      .replace('{enforced_goals}', JSON.stringify(input.enforcedGoals))
      .replace('{satisfied_goals}', JSON.stringify(input.satisfiedGoals))
      .replace('{unsatisfied_goals}', JSON.stringify(input.unsatisfiedGoals))
      .replace('{existing_plan_properties}', JSON.stringify(input.existingPlanProperties));
  }

function prepareQuestionTranslatorHistory(history: QuestionTranslatorHistory): Message[] {
    let messages: Message[] ;
    for (const step of history) {
        const input = step.input;
        const output = step.output;
        const input_message = prepareQuestionTranslatorMessage(input);

        messages.push({role: "user", content: input_message});
        messages.push({role: "assistant", content: output});
    }
    return messages
}
