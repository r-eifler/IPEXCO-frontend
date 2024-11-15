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
        .replace('{enforced_goals}', `[${request.enforcedGoals.map(goal => goal.name).join(', ')}]`)
        .replace('{satisfied_goals}', `[${request.satisfiedGoals.map(goal => goal.name).join(', ')}]`)
        .replace('{unsatisfied_goals}', `[${request.unsatisfiedGoals.map(goal => goal.name).join(', ')}]`)
        .replace('{existing_plan_properties}', `[${request.existingPlanProperties.map(property => property.name).join(', ')}]`)
        .replace('{solvable}', request.solvable);
}

export function explanationTranslationRequestToString(request: ExplanationTranslationRequest): string {
    return templates.explanation_translator
        .replace('{question}', request.question)
        .replace('{question_type}', request.question_type)
        .replace('{question_arguments}', `[${request.questionArguments.map(argument => argument.name).join(', ')}]`)
        .replace('{mugs}', `[${request.MUGS.map(mug => `[${mug.map(p => p.name).join(', ')}]`).join(', ')}]`)
        .replace('{mgcs}', `[${request.MGCS.map(mgc => `[${mgc.map(p => p.name).join(', ')}]`).join(', ')}]`)
        .replace('{enforced_goals}', `[${request.enforcedGoals.map(goal => goal.name).join(', ')}]`)
        .replace('{satisfied_goals}', `[${request.satisfiedGoals.map(goal => goal.name).join(', ')}]`)
        .replace('{unsatisfied_goals}', `[${request.unsatisfiedGoals.map(goal => goal.name).join(', ')}]`)
        .replace('{existing_plan_properties}', `[${request.existingPlanProperties.map(property => property.name).join(', ')}]`);
}
