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
        .replace('{solvable}', request.solvable);
}

export function explanationTranslationRequestToString(request: ExplanationTranslationRequest): string {
    return templates.explanation_translator
        .replace('{question}', request.question)
        .replace('{question_type}', request.question_type)
        .replace('{question_arguments}', `[${request.questionArgument.map(argument => argument.name).join(', ')}]`)
        .replace('{mugs}', `[${request.MUGS.map(mug => `[${mug.map(p => p.name).join(', ')}]`).join(', ')}]`)
        .replace('{mgcs}', `[${request.MGCS.map(mgc => `[${mgc.map(p => p.name).join(', ')}]`).join(', ')}]`)
        .replace('{enforced_goals}', `[${request.enforcedGoals.map(goal => goal.name).join(', ')}]`)
        .replace('{satisfied_goals}', `[${request.satisfiedGoals.map(goal => goal.name).join(', ')}]`)
        .replace('{unsatisfied_goals}', `[${request.unsatisfiedGoals.map(goal => goal.name).join(', ')}]`);
}

export function multipleExplanationTranslationRequestToString(request: ExplanationTranslationRequest[]): string {
    console.log('request', request);

    let output_str = "Question: " + request[0].question + "\nQuestion Type: " + request[0].question_type + "\n";
    for (let r of request) {
        output_str += templates.multiple_explanation_translator_question
            .replace('{question_arguments}', `[${r.questionArgument.map(argument => argument.name).join(', ')}]`)
            .replace('{mugs}', `[${r.MUGS.map(mug => `[${mug.map(p => p.name).join(', ')}]`).join(', ')}]`)
            .replace('{mgcs}', `[${r.MGCS.map(mgc => `[${mgc.map(p => p.name).join(', ')}]`).join(', ')}]`)
    }
    output_str += templates.multiple_explanation_translator_context
        .replace('{enforced_goals}', `[${request[0].enforcedGoals.map(goal => goal.name).join(', ')}]`)
        .replace('{satisfied_goals}', `[${request[0].satisfiedGoals.map(goal => goal.name).join(', ')}]`)
        .replace('{unsatisfied_goals}', `[${request[0].unsatisfiedGoals.map(goal => goal.name).join(', ')}]`);

    return output_str;
}