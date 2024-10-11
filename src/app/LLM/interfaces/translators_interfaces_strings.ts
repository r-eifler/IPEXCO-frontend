import { GoalTranslationRequest, QuestionTranslationRequest, ExplanationTranslationRequest } from './translators_interfaces';
import templates from './templates.json';

export function goalTranslationRequestToString(request: GoalTranslationRequest): string {
    return templates.goal_translator
        .replace('{goal}', request.goalDescription)
        .replace('{predicates}', `[${request.predicates.map(predicate => predicate.name + " " + (predicate.parameters.length === 0 ? '' : predicate.parameters.map(p => p.name).join(' '))).join(', ')}]`)
        .replace('{objects}', `[${request.objects.map(object => object.name).join(', ')}]`)
        .replace('{existing_plan_properties}', `[${request.existingPlanProperties.map(property => property.name).join(', ')}]`);
}

export function questionTranslationRequestToString(request: QuestionTranslationRequest): string {
    return templates.question_translator
        .replace('{question}', request.question)
        .replace('{enforced_goals}', JSON.stringify(request.enforcedGoals))
        .replace('{satisfied_goals}', JSON.stringify(request.satisfiedGoals))
        .replace('{unsatisfied_goals}', JSON.stringify(request.unsatisfiedGoals))
        .replace('{existing_plan_properties}', JSON.stringify(request.existingPlanProperties));
}

export function explanationTranslationRequestToString(request: ExplanationTranslationRequest): string {
    return templates.explanation_translator
        .replace('{question}', request.question)
        .replace('{question_type}', request.question_type)
        .replace('{question_arguments}', JSON.stringify(request.questionArguments))
        .replace('{mugs}', JSON.stringify(request.MUGS))
        .replace('{mgcs}', JSON.stringify(request.MGCS))
        .replace('{enforced_goals}', JSON.stringify(request.enforcedGoals))
        .replace('{satisfied_goals}', JSON.stringify(request.satisfiedGoals))
        .replace('{unsatisfied_goals}', JSON.stringify(request.unsatisfiedGoals))
        .replace('{existing_plan_properties}', JSON.stringify(request.existingPlanProperties));
}