import { PlanPropertyTemplate } from "src/app/shared/domain/plan-property/plan-property-template";

export interface DomainSpecification {
    _id?: string;
    name: string;
    planPropertyTemplates: PlanPropertyTemplate[]  ;
    description: string;
}
